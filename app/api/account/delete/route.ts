import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Order from "@/lib/database/models/order.model";
import { isValidObjectId } from "mongoose";

/**
 * DELETE /api/account - Delete current user's account
 * Cascades deletion to Clerk, MongoDB User, related Events, and Orders
 */
export async function DELETE(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Find user in DB
    let dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser && isValidObjectId(userId)) {
      dbUser = await User.findById(userId);
    }

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const mongoUserId = dbUser._id.toString();

    // 1. Delete all events owned by this user
    await Event.deleteMany({ organizer: mongoUserId });

    // 2. Delete all orders for this user (as buyer)
    await Order.deleteMany({ buyer: mongoUserId });

    // 3. Delete user from MongoDB
    await User.findByIdAndDelete(mongoUserId);

    // 4. Delete user from Clerk
    await clerkClient.users.deleteUser(userId);

    return NextResponse.json(
      {
        ok: true,
        message: "Account and all associated data deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      {
        error: "Failed to delete account",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
