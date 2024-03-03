import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import React from "react";

type UpdateEventProps = {
	params: {
		id: string;
	};
};

const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
	const event = await getEventById(id);
	const { sessionClaims } = auth();
	const userId = sessionClaims?.userId as string;
	return (
		<>
			<section className="bg-slate-300 bg-dotted-pattern bg-cover bg bg-center py-5 md:py-10 ">
				<h3 className="wrapper h3-bold text-center sm:text-center">
					Update Event
				</h3>
			</section>
			<div className="wrapper my-8">
				<EventForm
					userId={userId}
					type="Update"
					event={event}
					eventId={event._id}
				/>
			</div>
		</>
	);
};

export default UpdateEvent;
