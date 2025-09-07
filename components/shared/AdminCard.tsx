import { IEvent } from "@/lib/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { checkRole } from "@/utils/roles";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const AdminCard = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const isAdmin = checkRole("admin");

  return (
    <div className="group relative flex min-h-[400px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-105 hover:shadow-2xl md:min-h-[450px]">
      {/* Event Image */}
      <Link
        href={`/events/${event._id}`}
        className="relative flex-grow overflow-hidden rounded-t-xl"
      >
        <div className="absolute inset-0 bg-black/25 transition-opacity group-hover:bg-black/10"></div>
        <Image
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
          fill
        />
      </Link>

      {/* Admin Controls */}
      {isAdmin && !hidePrice && (
        <div className="absolute right-3 top-3 flex flex-col gap-3 rounded-xl bg-white p-3 shadow-md">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={24}
              height={24}
            />
          </Link>
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      {/* Event Info */}
      <div className="flex flex-col gap-2 p-5">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="rounded-full bg-gradient-to-r from-green-400 to-green-200 px-3 py-1 text-sm font-semibold text-white">
            {event.isFree ? "FREE" : `₹${event.price}`}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
            {event.category.name}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/events/${event._id}`}>
          <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
        </Link>

        <div className="mt-3 flex justify-between items-center">
          <p className="text-gray-600">
            {event.organizer.firstName} {event.organizer.lastName}
          </p>
          {hasOrderLink && (
            <Link
              href={`/orders?eventId=${event._id}`}
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              Orders
              <Image
                src="/assets/icons/arrow.svg"
                alt="arrow"
                width={12}
                height={12}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
