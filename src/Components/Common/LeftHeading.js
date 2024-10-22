import React, { memo } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const LeftHeading = ({ leftHeading, navigate }) => {
  const [mainHeading, subHeading] = leftHeading; // Destructure for clarity

  return (
    <div className="flex-1 text-md font-semibold ps-4 capitalize">
      {subHeading ? (
        <div className="flex items-center gap-1">
          <span className="opacity-55  flex items-center text-gray-500">
            <button
              onClick={() => navigate(-1)}
              className="mr-1 capitalize"
              title="Back"
              aria-label="Go back"
            >
              {mainHeading}
            </button>
            <MdOutlineKeyboardDoubleArrowRight
              className="text-2xl"
              aria-hidden="true"
            />
          </span>
          <h1 className="text-gradient text-md font-bold">{subHeading}</h1>
        </div>
      ) : (
        <span className="text-gradient capitalize">{mainHeading}</span>
      )}
    </div>
  );
};

// Memoizing the component to prevent unnecessary re-renders
export default memo(LeftHeading);
