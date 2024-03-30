import AdminCollection from "@/components/shared/AdminCollection";
import CategoryFilter from "@/components/shared/CategoryFilter";
import Search from "@/components/shared/Search";
import { getAllEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";
import { SearchParamProps } from "@/types";
import React from "react";

const UpcomingEvents = async ({ searchParams }: SearchParamProps) => {
	const page = Number(searchParams?.page) || 1;
	const searchText = (searchParams?.query as string) || "";
	const category = (searchParams?.category as string) || "";
	const events = await getAllEvents({
		query: searchText,
		category,
		page,
		limit: 6,
  });

  const currentDateTime = new Date()
  const filterEvents = events?.data.filter((item:IEvent) => {
    const startDateTime = new Date(item.startDateTime)
    return startDateTime > currentDateTime
  })
  
  

	return (
		<>
			<section
				id="events"
				className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<div className="flex w-full flex-col gap-5 md:flex-row">
					<Search />
					<CategoryFilter />
				</div>
				<AdminCollection
					data={filterEvents}
					emptyTitle="No Events Avaliable"
					emptyStateSubtext="Come Back Later"
					collectionType="All_Events"
					limit={6}
					page={Number(searchParams?.page) || 1}
					totalPages={filterEvents?.totalPages}
				/>
			</section>
		</>
	);
};

export default UpcomingEvents;
