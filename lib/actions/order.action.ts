"use server";

import Stripe from "stripe";

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import { ObjectId } from "mongodb";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import { isValidObjectId } from "mongoose";

// CHECK IF USER ALREADY BOUGHT EVENT
export async function hasUserBoughtEvent(userId: string, eventId: string) {
  try {
    await connectToDatabase();

    // Resolve Clerk ID or Mongo ID to Mongo ID
    let buyerId = userId;
    if (!isValidObjectId(userId)) {
      const dbUser = await User.findOne({ clerkId: userId });
      if (!dbUser) return false;
      buyerId = dbUser._id.toString();
    }

    const order = await Order.findOne({
      buyer: buyerId,
      event: eventId,
    });

    return !!order;
  } catch (error) {
    console.error("Error checking purchase:", error);
    return false;
  }
}

// ✅ Checkout Order with Indian export compliance
// export const checkoutOrder = async (order: CheckoutOrderParams) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//   const price = order.isFree ? 0 : Number(order.price) * 100;

//   try {
//     await connectToDatabase();

//     // 🔍 Fetch buyer details from your User database
//     const buyer = await User.findById(order.buyerId);
//     if (!buyer) throw new Error("Buyer not found");

//     // Create Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             unit_amount: price,
//             product_data: {
//               name: order.eventTitle,
//             },
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
//       cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,

//       // ✅ Pull details from your DB
//       customer_email: buyer.email,
//       customer_creation: "always",

//       // ✅ India compliance → force billing address
//       billing_address_collection: "required",

//       // ❌ Removed shipping address collection (not needed if India only)

//       metadata: {
//         eventId: order.eventId,
//         buyerId: order.buyerId,
//         purpose_code: "P0108", // RBI purpose code (e.g. IT/software services)
//       },
//     });

//     redirect(session.url!);
//   } catch (error) {
//     throw error;
//   }
// };
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    await connectToDatabase();

    let buyer;

    // 1. CHECK: Is this a valid MongoDB ObjectId? (e.g., "65a4c...")
    if (isValidObjectId(order.buyerId)) {
      buyer = await User.findById(order.buyerId);
    }

    // 2. CHECK: If not found yet, try searching by Clerk ID (e.g., "user_2b...")
    if (!buyer) {
      buyer = await User.findOne({ clerkId: order.buyerId });
    }

    // 3. FINAL CHECK: If still no buyer, the webhook likely failed.
    if (!buyer) {
      throw new Error(
        "Buyer not found in database. Ensure the webhook is set up correctly."
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      customer_email: buyer.email,
      customer_creation: "always",
      billing_address_collection: "required",
      metadata: {
        eventId: order.eventId,
        // SAVE THE MONGO ID, NOT CLERK ID
        buyerId: buyer._id.toString(),
        quantity: (order.quantity || 1).toString(),
        purpose_code: "P0108",
      },
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};
// The rest of your order functions remain unchanged
export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDatabase();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      { $unwind: "$buyer" },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAT: 1,
          eventTitle: "$event.title",
          eventId: "$event._id",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
}

export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    await connectToDatabase();

    // Resolve Clerk ID or Mongo ID to Mongo ID
    let buyerId = userId;
    if (!isValidObjectId(userId)) {
      const dbUser = await User.findOne({ clerkId: userId });
      if (!dbUser) throw new Error("User not found");
      buyerId = dbUser._id.toString();
    }

    const skipAmount = (Number(page) - 1) * limit;

    // Find orders for the buyer and populate the event and organizer
    const orders = await Order.find({ buyer: buyerId })
      .sort({ createdAT: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount = await Order.countDocuments({ buyer: buyerId });

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
