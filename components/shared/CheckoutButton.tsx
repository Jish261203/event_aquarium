"use client";
import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";

const CheckoutButton = ({ event }: { event: IEvent }) => {
	const hasEventFinsihed = new Date(event.startDateTime) < new Date();
	const { user } = useUser();
	const userId = user?.publicMetadata.userId as string;
	return (
		<div className="flex items-center gap-3">
			{hasEventFinsihed ? (
				<p className="p-2 text-red-400">
					Sorry Tickets are no longer avaliable
				</p>
			) : (
				<>	
					<SignedOut>
						<Button
							asChild
							size="lg"
							className="button w-full sm:w-fit scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-110 ">
							<Link href="/sign-in">Get Tickets</Link>
						</Button>
					</SignedOut>

					<SignedIn>
						<Checkout event={event} userId={userId} />
					</SignedIn>
				</>
			)}
		</div>
	);
};

export default CheckoutButton;
