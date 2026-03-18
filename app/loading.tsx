import React from "react";
import Loader from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Loader />
    </div>
  );
}
