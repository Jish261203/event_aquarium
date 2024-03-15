import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.action";
import { IOrder } from "@/lib/database/models/order.model";
import { auth } from "@clerk/nextjs";
import { pages } from "next/dist/build/templates/app-page";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {
	const { sessionClaims } = auth();

	const userId = sessionClaims?.userId as string;

	const organizedEvents = await getEventByUser({ userId, page: 1 });
	
	const orders = await getOrdersByUser({ userId, page: 1 })
	
	const orderEvents = orders?.data.map((order: IOrder) => order.event) || []
	
	

	return (
		<>
			{/* My Tickets  */}

			<section className="bg-slate-300 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<div className="wrapper flex items-center justify-center sm:justify-between">
					<h3 className="h3-bold text-center sm:text-left ">Booked Tickets</h3>
					<Button
						asChild
						className="relative rounded-full scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-125 button hidden sm:flex ">
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
					page={1}
					urlParamName="ordersPage"
					totalPages={2}
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
						className="relative rounded-full scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-125 button hidden sm:flex ">
						<Link href="/events/create">Explore More Events</Link>
					</Button>
				</div>
			</section>

			<section className="wrapper my-8">
				<Collection
					data={organizedEvents?.data}
					emptyTitle="No Events Yet!"
					emptyStateSubtext="Time to Create Some Events Now!"
					collectionType="Event_Organized"
					limit={3}
					page={1}
					urlParamName="eventsPage"
					totalPages={2}
				/>
			</section>
		</>
	);
};

export default ProfilePage;
