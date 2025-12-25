import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Get first 3 events and set their end dates to past (yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await Event.updateMany(
      {},
      {
        endDateTime: yesterday,
      },
      { limit: 3 }
    );

    console.log(`[Update Event Dates] Updated ${result.modifiedCount} events with past end dates`);

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
