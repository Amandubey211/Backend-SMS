import React from "react";

const SkeletonSubjectCard = () => (
  <div
    className="bg-white shadow-md rounded-lg flex flex-col gap-3 p-4 border
               border-gray-200 animate-pulse"
  >
    {/* Header */}
    <div className="flex items-center gap-2">
      {/* icon placeholder */}
      <div className="w-[50px] h-[50px] rounded-md bg-gray-200" />
      <div className="flex flex-col gap-1 flex-1">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>

    {/* Progress bar */}
    <div className="w-full bg-gray-200 rounded-full h-1.5" />

    {/* Footer */}
    <div className="flex justify-between items-center text-sm">
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-3 w-10 bg-gray-200 rounded" />
    </div>
  </div>
);

export default SkeletonSubjectCard;
