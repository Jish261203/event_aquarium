"use client";
import React, { useState, useEffect } from "react";
import {
	getTotaEventCount,
	getTotalOrderCount,
	getTotalUserCount,
} from "@/lib/actions/user.action";
import { getAllEvents } from "@/lib/actions/user.action";
import Image from "next/image";

interface IEvent {
	title: string;
	location: string;
	startDateTime: string;
	endDateTime: string;
	price: string;
}

interface CardProps {
	title: string;
	count: number;
	imageUrl: string;
}

const AdminDashboard: React.FC = () => {
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const [totalEvents, setTotalEvents] = useState<number>(0);
	const [totalOrders, setTotalOrders] = useState<number>(0);
	const [events, setEvents] = useState<IEvent[]>([]);

	

	useEffect(() => {
		const fetchData = async () => {
			try {
				const users = await getTotalUserCount();
				setTotalUsers(users ?? 0);

				const eventCount = await getTotaEventCount();
				setTotalEvents(eventCount ?? 0);

				const orders = await getTotalOrderCount();
				setTotalOrders(orders ?? 0);

				const fetchedEvents: IEvent[] = await getAllEvents();
				setEvents(fetchedEvents);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	return (
		<>
			<section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<h3 className="wrapper h3-bold text-center sm:text-left ">
					Dashboard
				</h3>
			</section>
			<section className="wrapper overflow-x-auto">
				<div className="flex-1 space-y-4 p-8 pt-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card
							title="Total Users"
							count={totalUsers}
							imageUrl="/assets/images/users.png"
						/>
						<Card
							title="Total Events"
							count={totalEvents}
							imageUrl="/assets/images/calendar-image.png"
						/>
						<Card
							title="Total Orders"
							count={totalOrders}
							imageUrl="/assets/images/clipboard.png"
						/>
						<Card
							title="Total Revenue"
							count={0}
							imageUrl="/assets/images/profit.png"
						/>
					</div>
				</div>
				<div>
					<section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
						<h3 className="wrapper h3-bold text-center sm:text-left ">
							All Events
						</h3>
					</section>
					<table className="w-full border-collapse border-t">
						<thead>
							<tr className="p-medium-14 border-b text-grey-500">
								<th className="min-w-[250px] py-3 text-left">Event Title</th>
								<th className="min-w-[200px] flex-1 py-3 pr-4 text-left">
									Location
								</th>
								<th className="min-w-[150px] py-3 text-left">Start Date</th>
								<th className="min-w-[150px] py-3 text-left">End Date</th>
								{/* <th className="min-w-[150px] py-3 text-left">Time</th> */}
								<th className="min-w-[100px] py-3 text-left">Price</th>
							</tr>
						</thead>
						<tbody>
							{events.map((event, index) => (
								<tr
									key={index}
									className="p-regular-14 lg:p-regular-16 border-b "
									style={{ boxSizing: "border-box" }}>
									<td className="min-w-[250px] py-4 text-primary-500">
										{event.title}
									</td>
									<td className="min-w-[200px] flex-1 py-4 pr-4">
										{event.location}
									</td>
									<td className="min-w-[150px] py-4">{event.startDateTime}</td>
									<td className="min-w-[150px] py-4">{event.endDateTime}</td>
									<td className="min-w-[100px] py-4">{event.price}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</>
	);
};

interface CardProps {
	title: string;
	count: number;
}

const Card: React.FC<CardProps> = ({ title, count, imageUrl }) => {
	return (
		<div className="bg-white border rounded-lg overflow-hidden shadow-sm flex items-center">
			<div className="p-4 flex-grow">
				<h3 className="text-sm font-medium text-gray-600">{title}</h3>
				<p className="text-2xl font-bold">{count}</p>
			</div>
			
				<div className="w-14 h-20 p-4 ">
					<Image src={imageUrl} alt={title} width={64} height={64} />
				</div>
		</div>
	);
};

export default AdminDashboard;
