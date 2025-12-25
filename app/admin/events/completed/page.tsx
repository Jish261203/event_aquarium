import AdminCollection from "@/components/shared/AdminCollection";
import CategoryFilter from "@/components/shared/CategoryFilter";
import Search from "@/components/shared/Search";
import { getAllEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";
import { SearchParamProps } from "@/types";
import React from "react";

const CompletedEvents = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  // Fetch ALL events without pagination to ensure we get completed ones
  const events = await getAllEvents({
    query: searchText,
    category,
    page: 1,
    limit: 100, // Fetch more events to find completed ones
  });

  const currentDateTime = new Date();
  console.log(`[Completed Events] Current time:`, currentDateTime);
  console.log(`[Completed Events] Total events fetched:`, events?.data?.length);

  const filterEvents =
    events?.data?.filter((item: IEvent) => {
      // Ensure endDateTime is converted to Date object
      const endDateTime =
        typeof item.endDateTime === "string"
          ? new Date(item.endDateTime)
          : item.endDateTime;

      const isCompleted = endDateTime < currentDateTime;
      console.log(
        `[Completed Events] Event: "${
          item.title
        }", EndDate: ${endDateTime.toISOString()}, IsCompleted: ${isCompleted}`
      );
      return isCompleted;
    }) || [];

  console.log(
    `[Completed Events] Total events: ${events?.data?.length}, Filtered completed: ${filterEvents?.length}`
  );
  if (filterEvents && filterEvents.length > 0) {
    console.log(
      `[Completed Events] First event end date:`,
      filterEvents[0].endDateTime
    );
  }

  // Serialize the filtered events to ensure Date objects are converted to strings
  const serializedEvents = filterEvents
    ? JSON.parse(JSON.stringify(filterEvents))
    : [];

  return (
    <>
      <section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left ">
          Completed Events
        </h3>
      </section>
      <section
        id="events"
        className="wrapper my-8 mt-20 overflow-y-auto max-h-[calc(100vh-150px)]"
      >
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <AdminCollection
          data={serializedEvents}
          emptyTitle="No Events Avaliable"
          emptyStateSubtext="Come Back Later"
          collectionType="All_Events"
          limit={6}
          page={Number(searchParams?.page) || 1}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
};

export default CompletedEvents;
