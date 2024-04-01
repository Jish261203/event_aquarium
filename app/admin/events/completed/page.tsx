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
	const events = await getAllEvents({
		query: searchText,
		category,
		page,
		limit: 6,
	});

	const currentDateTime = new Date();
	const filterEvents = events?.data.filter((item: IEvent) => {
		const startDateTime = new Date(item.startDateTime);
		return startDateTime < currentDateTime;
	});

	return (
		<>
			<section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<h3 className="wrapper h3-bold text-center sm:text-left ">
					Completed Events
				</h3>
			</section>
			<section
				id="events"
				className="wrapper my-8 mt-20 overflow-y-auto max-h-[calc(100vh-150px)]">
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

export default CompletedEvents;
