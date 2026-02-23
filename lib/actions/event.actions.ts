"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import { isValidObjectId } from "mongoose";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();

    // Support passing either a MongoDB ObjectId or a Clerk user id.
    let organizer = null;
    if (isValidObjectId(userId)) {
      organizer = await User.findById(userId);
    } else {
      organizer = await User.findOne({ clerkId: userId });
    }

    // If organizer is not in our DB (webhook may not have run), try to fetch from Clerk and create locally
    if (!organizer) {
      // Declare these in outer scope so catch can inspect them when creation fails
      let cu: any = null;
      let email: string = "";
      let generatedUsername: string = "";
      let firstName: string = "";
      let lastName: string = "";
      let photo: string = "";

      try {
        cu = await clerkClient.users.getUser(userId);
        email = cu.emailAddresses?.[0]?.emailAddress || "";
        generatedUsername =
          cu.username ||
          (email ? email.split("@")[0] : cu.id?.slice(0, 8) || "user");
        firstName = cu.firstName || "User";
        lastName = cu.lastName || "";
        photo = cu.imageUrl || cu.profileImageUrl || "";

        organizer = await User.create({
          clerkId: cu.id,
          email,
          username: generatedUsername,
          firstName,
          lastName,
          photo,
        });
      } catch (err: any) {
        console.error("Failed to fetch/create organizer from Clerk:", err);

        // If creation failed due to duplicate key (email/username), try to find the existing user
        const isDuplicateKey =
          err && (err.code === 11000 || String(err).includes("duplicate key"));
        if (isDuplicateKey) {
          try {
            const existing = await User.findOne({
              $or: [
                { clerkId: cu?.id },
                { email },
                { username: generatedUsername },
              ],
            });
            if (existing) {
              organizer = existing;
            } else {
              throw err;
            }
          } catch (findErr) {
            console.error(
              "Error finding existing user after duplicate key:",
              findErr,
            );
            throw new Error("Organizer not found or could not be created");
          }
        } else {
          // Other errors are surfaced
          throw new Error("Organizer not found or could not be created");
        }
      }
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: organizer._id,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));

    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    // Resolve provided userId (can be Clerk id or Mongo id) to a Mongo id string
    let organizerId = userId;
    if (!isValidObjectId(userId)) {
      const dbUser = await User.findOne({ clerkId: userId });
      if (!dbUser) throw new Error("Unauthorized or event not found");
      organizerId = dbUser._id.toString();
    }

    const eventToUpdate = await Event.findById(event._id);
    if (
      !eventToUpdate ||
      eventToUpdate.organizer.toHexString() !== organizerId
    ) {
      throw new Error("Unauthorized or event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true },
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ createdAT: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDatabase();

    // Resolve Clerk or Mongo userId to Mongo id
    let organizerId = userId;
    if (!isValidObjectId(userId)) {
      const dbUser = await User.findOne({ clerkId: userId });
      if (!dbUser) throw new Error("User not found");
      organizerId = dbUser._id.toString();
    }

    const conditions = { organizer: organizerId };
    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAT: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAT: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
