import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import DeleteAccountButton from "@/components/shared/DeleteAccountButton";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.action";
import { createUser } from "@/lib/actions/user.action";
import { IOrder } from "@/lib/database/models/order.model";
import { SearchParamProps } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs";
import { pages } from "next/dist/build/templates/app-page";
import Link from "next/link";
import React from "react";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const ordersPage = Number(searchParams?.ordersPage) || 1;

  const eventsPage = Number(searchParams?.eventsPage) || 1;

  let organizedEvents;
  let orders;

  try {
    organizedEvents = await getEventsByUser({ userId, page: eventsPage });
    orders = await getOrdersByUser({ userId, page: ordersPage });
  } catch (error) {
    // If user not found, attempt to auto-create from Clerk data
    if (error instanceof Error && error.message.includes("User not found")) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const newUser = await createUser({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          username:
            clerkUser.username ||
            clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] ||
            userId.slice(0, 8),
          firstName: clerkUser.firstName || "User",
          lastName: clerkUser.lastName || "",
          photo: clerkUser.imageUrl || "",
        });

        if (newUser) {
          // Retry the data fetches
          organizedEvents = await getEventsByUser({ userId, page: eventsPage });
          orders = await getOrdersByUser({ userId, page: ordersPage });
        }
      } catch (initError) {
        console.error("Error auto-creating user:", initError);
        organizedEvents = { data: [], totalPages: 0 };
        orders = { data: [], totalPages: 0 };
      }
    } else {
      throw error;
    }
  }

  const orderEvents = orders?.data.map((order: IOrder) => order.event) || [];

  return (
    <>
      {/* My Tickets  */}

      <section className="bg-slate-300 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left ">Booked Tickets</h3>
          <Button
            asChild
            className="relative rounded-full scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-125 button hidden sm:flex "
          >
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderEvents}
          emptyTitle="Tickets Await: You Haven't Purchased Yet!"
          emptyStateSubtext="Explore thrilling events now - get your tickets!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      {/* Event Organized */}

      <section className="bg-slate-300 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left ">
            Events Organized
          </h3>
          <Button
            asChild
            className="relative rounded-full scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-125 button hidden sm:flex "
          >
            <Link href="/events/create">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data || []}
          emptyTitle="No Events Yet!"
          emptyStateSubtext="Time to Create Some Events Now!"
          collectionType="Event_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>

      {/* Account Settings */}
      <section className="wrapper my-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="h3-bold mb-4">Account Settings</h3>
        <p className="text-gray-600 mb-4">
          Danger Zone: Once you delete your account, there is no going back.
          Please be certain.
        </p>
        <DeleteAccountButton />
      </section>
    </>
  );
};

export default ProfilePage;
