import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";
import React from "react";
import { redirect } from "next/navigation";

const CreateEvent = () => {
  const { userId } = auth();

  // If not authenticated, redirect to Clerk sign-in to ensure userId is available
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <section className="bg-slate-400 bg-dotted-pattern bg-cover bg bg-center py-5 md:py-10 ">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;
