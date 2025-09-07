import { IEvent } from "@/lib/database/models/event.model";
import React from "react";
import Pagination from "./Pagination";
import AdminCard from "./AdminCard";

type CollectionProps = {
  data: IEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: "Event_Organized" | "My_Tickets" | "All_Events";
};

const AdminCollection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {data.map((event) => (
              <li key={event._id} className="flex justify-center">
                <AdminCard
                  event={event}
                  hasOrderLink={collectionType === "Event_Organized"}
                  hidePrice={collectionType === "My_Tickets"}
                />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className="flex-center flex-col gap-4 rounded-xl bg-gray-50 py-24 text-center">
          <img
            src="/assets/empty-state.svg"
            alt="No events"
            className="mx-auto w-32"
          />
          <h3 className="text-xl font-bold text-gray-700">{emptyTitle}</h3>
          <p className="text-gray-500">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default AdminCollection;
