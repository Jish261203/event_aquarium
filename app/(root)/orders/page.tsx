"use client";
import React, { useState, useEffect } from "react";
import Search from "@/components/shared/Search";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { IOrderItem } from "@/lib/database/models/order.model";
import { getOrdersByEvent } from "@/lib/actions/order.action";
import { deleteOrderFromEvent } from "@/lib/actions/user.action";
import { Trash } from "lucide-react";

const Orders = ({
	searchParams,
	
}: SearchParamProps) => {
	const eventId = (searchParams?.eventId as string) || "";
	const searchText = (searchParams?.query as string) || "";
	const [orders, setOrders] = useState<IOrderItem[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const ordersData = await getOrdersByEvent({
					eventId,
					searchString: searchText,
				});
				setOrders(ordersData);
			} catch (error) {
				console.error("Error fetching orders:", error);
			}
		};

		fetchData();
	}, [eventId, searchText]);

	const handleDeleteOrder = async (orderId: string) => {
		try {
			//Call the backend function to delete the order from the event
			await deleteOrderFromEvent(orderId);
			// Update the state after successful deletion
			const updatedOrders = orders.filter((order) => order._id !== orderId);
			setOrders(updatedOrders);
		} catch (error) {
			console.error("Error deleting order:", error);
		}
	};

	return (
		<>
			<section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<h3 className="wrapper h3-bold text-center sm:text-left ">Orders</h3>
			</section>

			<section className="wrapper mt-8">
				<Search placeholder="Search buyer name..." />
			</section>

			<section className="wrapper overflow-x-auto">
				<table className="w-full border-collapse border-t">
					<thead>
						<tr className="p-medium-14 border-b text-grey-500">
							<th className="min-w-[250px] py-3 text-left">Order ID</th>
							<th className="min-w-[200px] flex-1 py-3 pr-4 text-left">
								Event Title
							</th>
							<th className="min-w-[150px] py-3 text-left">Buyer</th>
							<th className="min-w-[100px] py-3 text-left">Created</th>
							<th className="min-w-[100px] py-3 text-right">Amount</th>
						</tr>
					</thead>
					<tbody>
						{orders.length === 0 ? (
							<tr className="border-b">
								<td colSpan={6} className="py-4 text-center text-gray-500">
									No orders found.
								</td>
							</tr>
						) : (
							orders.map((row: IOrderItem) => (
								<tr
									key={row._id}
									className="p-regular-14 lg:p-regular-16 border-b"
									style={{ boxSizing: "border-box" }}>
									<td className="min-w-[250px] py-4 text-primary-500">
										{row._id}
									</td>
									<td className="min-w-[200px] flex-1 py-4 pr-4">
										{row.eventTitle}
									</td>
									<td className="min-w-[150px] py-4">{row.buyer}</td>
									<td className="min-w-[100px] py-4">
										{formatDateTime(row.createdAT).dateTime}
									</td>
									<td className="min-w-[100px] py-4 text-right">
										{formatPrice(row.totalAmount)}
									</td>
									<td className="min-w-[100px] py-4 text-right">
										<button onClick={() => handleDeleteOrder(row._id)}>
											<Trash size={24} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</section>
		</>
	);
};

export default Orders;