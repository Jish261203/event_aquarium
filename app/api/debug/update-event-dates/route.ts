import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Get first 3 events and set their end dates to past (yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Find first 3 events
    const eventsToUpdate = await Event.find({}).limit(3);

    if (eventsToUpdate.length === 0) {
      return NextResponse.json({
        message: "No events found to update",
      });
    }

    // Update those events with past end dates
    const eventIds = eventsToUpdate.map((e) => e._id);
    const result = await Event.updateMany(
      { _id: { $in: eventIds } },
      {
        endDateTime: yesterday,
      }
    );

    console.log(
      `[Update Event Dates] Updated ${result.modifiedCount} events with past end dates`
    );

    return NextResponse.json({
      message: `Updated ${result.modifiedCount} events with past end dates (yesterday)`,
      endDateTime: yesterday,
    });
  } catch (error) {
    console.error("[Update Event Dates] Error:", error);
    return NextResponse.json(
      { error: "Failed to update events", details: String(error) },
      { status: 500 }
    );
  }
}
