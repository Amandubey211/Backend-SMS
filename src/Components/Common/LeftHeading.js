import React from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const LeftHeading = ({ leftHeading, navigate }) => (
  <div className="flex-1 text-md font-semibold ps-4 capitalize">
    {leftHeading[1] === undefined ? (
      <span className="text-gradient capitalize">{leftHeading[0]}</span>
    ) : (
      <div className="flex items-center gap-1">
        <span className="opacity-55 font-bold flex items-center text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="mr-1 capitalize"
            title="Back"
            aria-label="Go back"
          >
            {leftHeading[0]}
          </button>
          <MdOutlineKeyboardDoubleArrowRight
            className="text-2xl"
            aria-hidden="true"
          />
        </span>
        <h1 className="text-gradient text-md font-bold">{leftHeading[1]}</h1>
      </div>
    )}
  </div>
);

export default LeftHeading;
