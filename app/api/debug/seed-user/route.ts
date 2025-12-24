import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { createUser } from "@/lib/actions/user.action";
import User from "@/lib/database/models/user.model";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "not-authenticated" }, { status: 401 });
  }

  try {
    // If a Mongo user already exists for this Clerk id, return it
    const existing = await User.findOne({ clerkId: userId });
    if (existing) {
      return NextResponse.json({
        ok: true,
        created: false,
        user: JSON.parse(JSON.stringify(existing)),
      });
    }

    // Fetch Clerk user
    const cu = await clerkClient.users.getUser(userId);

    const email = cu.emailAddresses?.[0]?.emailAddress ?? "";

    const newUser = await createUser({
      clerkId: cu.id,
      email,
      username: cu.username ?? "",
      firstName: cu.firstName ?? "",
      lastName: cu.lastName ?? "",
      photo: cu.profileImageUrl ?? cu.imageUrl ?? "",
    });

    // Update Clerk public metadata with the Mongo id so client code can read it
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { userId: newUser._id },
    });

    return NextResponse.json({ ok: true, created: true, user: newUser });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
