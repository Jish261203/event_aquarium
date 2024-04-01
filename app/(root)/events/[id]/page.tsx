import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
	getEventById,
	getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EventDetails = async ({
	params: { id },
	searchParams,
}: SearchParamProps) => {
	const event = await getEventById(id);

	const relatedEvents = await getRelatedEventsByCategory({
		categoryId: event.category._id,
		eventId: event._id,
		page: searchParams.page as string,
	});

	return (
		<>
			<section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="relative overflow-hidden rounded-lg col-span-2 md:col-span-2 h-96">
						{" "}
						<Image
							src={event.imageUrl}
							alt="hero image"
							layout="fill"
							objectFit="cover"
							objectPosition="center"
							unoptimized
						/>
					</div>

					<div className="flex flex-col justify-center gap-8 p-5 bg-white rounded-lg shadow-lg col-span-1 md:col-span-1">
						<h2 className="text-2xl font-bold">{event.title}</h2>

						<div className="flex flex-col gap-3">
							<div className="flex gap-3">
								<p className="text-green-700 rounded-full bg-green-500/10 px-3 py-2">
									{event.isFree ? "FREE" : `₹${event.price}`}
								</p>
								<p className="text-gray-500 rounded-full bg-gray-500/10 px-4 py-2">
									{event.category.name}
								</p>
							</div>
							<p className="text-gray-600 text-lg">
								by{" "}
								<span className="text-primary-500">
									{event.organizer.firstName} {event.organizer.lastName}
								</span>
							</p>
						</div>

						<div className="flex flex-col gap-5">
							<div className="flex gap-2 md:gap-3 items-center">
								<Image
									src="/assets/icons/cal.svg"
									alt="calendar"
									width={32}
									height={32}
								/>
								<p className="text-lg">
									{formatDateTime(event.startDateTime).dateOnly}
									{formatDateTime(event.startDateTime).dateOnly ===
									formatDateTime(event.endDateTime).dateOnly
										? ""
										: ` - ${formatDateTime(event.endDateTime).dateOnly}`}
								</p>
							</div>
							<div className="flex gap-2 md:gap-3 items-center">
								<Image
									src="/assets/icons/time.svg"
									alt="time"
									width={32}
									height={32}
								/>
								<p className="text-lg">
									{formatDateTime(event.startDateTime).timeOnly} -{" "}
									{formatDateTime(event.endDateTime).timeOnly}
								</p>
							</div>
							<div className="flex items-center gap-3">
								<Image
									src="/assets/icons/location1.svg"
									alt="location"
									width={32}
									height={32}
								/>
								<p>{event.location}</p>
							</div>
							{/* Checkout Button  */}

							<div>
								<CheckoutButton event={event} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<div className="p-5 bg-white rounded-lg shadow-lg">
					<h3 className="h3-bold text-purple-900">About</h3>
					<br></br>
					<p className="font-bold text-gray-600 text-lg">Description</p>
					<p className="text-lg">{event.description}</p>
					<a
						href={event.url}
						className="text-primary-500 underline truncate"
						target="_blank"
						rel="noopener noreferrer">
						{event.url}
					</a>
				</div>
			</section>

			<section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<h2 className="h2-bold">Related Events</h2>
				<Collection
					data={relatedEvents?.data}
					emptyTitle="No Events Available"
					emptyStateSubtext="Come Back Later"
					collectionType="All_Events"
					limit={3}
					page={searchParams.page as string}
					totalPages={relatedEvents?.totalPages}
				/>
			</section>
		</>
	);
};

export default EventDetails;
