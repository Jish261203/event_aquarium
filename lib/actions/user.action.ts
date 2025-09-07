"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Order from "@/lib/database/models/order.model";
import Event from "@/lib/database/models/event.model";
import { handleError } from "@/lib/utils";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { clerkClient } from "@clerk/nextjs";

export async function createUser(user: CreateUserParams) {
	try {
		await connectToDatabase();

		const newUser = await User.create(user);
		return JSON.parse(JSON.stringify(newUser));
	} catch (error) {
		handleError(error);
	}
}

export async function getUserById(userId: string) {
	try {
		await connectToDatabase();

		const user = await User.findById(userId);

		if (!user) throw new Error("User not found");
		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		handleError(error);
	}
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
	try {
		await connectToDatabase();

		const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
			new: true,
		});

		if (!updatedUser) throw new Error("User update failed");
		return JSON.parse(JSON.stringify(updatedUser));
	} catch (error) {
		handleError(error);
	}
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Unlink relationships
    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // 🔥 Delete from Clerk
    await clerkClient.users.deleteUser(clerkId);

    // Delete from MongoDB
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAdminUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Unlink relationships
    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // 🔥 Delete from Clerk
    await clerkClient.users.deleteUser(clerkId);

    // Delete from MongoDB
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllAdminUser() {
	try {
		await connectToDatabase();
		const users = await User.find();

		// Return users if found, otherwise return an empty array
		return users ? users.map((user) => JSON.parse(JSON.stringify(user))) : [];
	} catch (error) {
		handleError(error);
		return []; // Return an empty array in case of error
	}
}

export async function getAllEvents() {
	try {
		await connectToDatabase();
		const events = await Event.find(
			{},
			"title location startDateTime endDateTime price"
		);

		// Map the events to the desired format
		const formattedEvents = events.map((event) => ({
			title: event.title,
			location: event.location,
			startDateTime: event.startDateTime,
			endDateTime: event.endDateTime,
			price: event.price,
		}));

		return formattedEvents;
	} catch (error) {
		handleError(error);
		return []; // Return an empty array in case of error
	}
}

export async function getTotalUserCount() {
	try {
		await connectToDatabase();

		// Use the countDocuments method to count the total number of users
		const totalCount = await User.countDocuments();

		return totalCount;
	} catch (error) {
		handleError(error);
	}
}

export async function getTotaEventCount() {
	try {
		await connectToDatabase();

		// Use the countDocuments method to count the total number of users
		const totalCount = await Event.countDocuments();

		return totalCount;
	} catch (error) {
		handleError(error);
	}
}

export async function getTotalOrderCount() {
	try {
		await connectToDatabase();

		// Use the countDocuments method to count the total number of users
		const totalCount = await Order.countDocuments();

		return totalCount;
	} catch (error) {
		handleError(error);
	}
}


export async function deleteOrderFromEvent(orderId: string) {
	try {
		await connectToDatabase();

		// Find the order to delete
		const orderToDelete = await Order.findOne({ _id: orderId });

		if (!orderToDelete) {
			throw new Error("Order not found");
		}

		// Unlink relationships only for this order
		await Promise.all([
			// Update the 'events' collection to remove references to the order for this specific event
			Event.updateMany(
				{ _id: orderToDelete.eventId },
				{ $pull: { orders: orderId } }
			),
			// Delete the order from the 'orders' collection
			Order.deleteOne({ _id: orderId }),
		]);

		return orderToDelete ? JSON.parse(JSON.stringify(orderToDelete)) : null;
	} catch (error) {
		handleError(error);
	}
}