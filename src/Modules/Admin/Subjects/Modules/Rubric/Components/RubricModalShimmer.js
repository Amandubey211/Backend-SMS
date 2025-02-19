// src/components/Components/RubricModalShimmer.js

import React from "react";

/**
 * Skeleton placeholder for the AddRubricModal,
 * closely matching the real layout with Tailwind’s `animate-pulse`.
 */
const RubricModalShimmer = () => {
  return (
    <div className="bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center p-1 mb-4">
        {/* "Add/Update Rubric" placeholder */}
        <div className="h-4 bg-gray-200 rounded w-32" />
        {/* Close button placeholder */}
        <div className="h-8 bg-gray-200 rounded w-8" />
      </div>

      {/* Input row (Rubric Name + Assignment/Quiz) */}
      <div className="flex gap-4 px-2 mb-4">
        <div className="flex-1">
          {/* "Rubric Name" label + input placeholder */}
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
        <div className="flex-1">
          {/* "Assignment/Quiz" label + dropdown placeholder */}
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      </div>

      {/* Main table container */}
      <div className="border m-2 p-4 h-[47vh] overflow-hidden">
        {/* Table header: Criteria | Ratings | Point */}
        <div className="flex font-semibold justify-between items-center p-2 bg-gray-100 rounded mb-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        {/* Table rows: each row -> (Criteria, Ratings, Point) */}
        {[1, 2].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between py-2 border-b"
          >
            {/* Criteria placeholder */}
            <div className="w-2/12 h-6 bg-gray-200 rounded" />

            {/* Ratings placeholder: two boxes for rating cards */}
            <div className="w-6/12 flex gap-2">
              <div className="w-20 h-16 bg-gray-200 rounded" />
              <div className="w-20 h-16 bg-gray-200 rounded" />
            </div>

            {/* Point placeholder */}
            <div className="w-1/12 h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Footer: Add New Criteria + total points */}
      <div className="flex justify-between items-center p-2 border-t">
        {/* "Add New Criteria" button placeholder */}
        <div className="h-8 bg-gray-200 rounded w-36" />
        {/* "Total Assignment Points" placeholder */}
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>

      {/* Bottom Buttons: Cancel & Save Rubric */}
      <div className="flex justify-end gap-3 items-center p-2">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default RubricModalShimmer;
