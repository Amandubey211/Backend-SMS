// src/pages/Components/RubricMainSectionShimmer.js

import React from "react";

/**
 * A skeleton placeholder for the main section where rubric cards appear.
 * It shows multiple skeleton cards, reflecting the final layout.
 */
const RubricMainSectionShimmer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {/* Display a fixed number of skeleton cards or map over an array */}
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="border rounded-md shadow-sm p-4 bg-white animate-pulse flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            {/* Title placeholder */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            {/* Rubric type badge placeholder */}
            <div className="h-4 bg-gray-200 rounded w-16 ml-2"></div>
          </div>
          <div className="flex gap-4 items-center mt-2">
            {/* Criteria placeholder */}
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            {/* Points placeholder */}
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex flex-col gap-2 text-xl items-end mt-4">
            {/* Icons placeholder */}
            <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RubricMainSectionShimmer;
