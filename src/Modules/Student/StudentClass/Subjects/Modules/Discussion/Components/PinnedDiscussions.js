import React, { useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { TbPin } from "react-icons/tb";

const PinnedDiscussions = ({ discussions }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-full p-3">
      <div className="flex justify-between items-center mb-4">
        <div
          className="text-xl flex items-center gap-1 cursor-pointer"
          onClick={toggleVisibility}
        >
          <TbPin className="text-green-500 text-xl" />
          <span>Pinned Discussions</span>
          <button
            onClick={toggleVisibility}
            aria-label="Toggle pinned discussions visibility"
          >
            {isVisible ? (
              <MdKeyboardArrowUp className="text-gray-500 h-8 w-8" />
            ) : (
              <MdKeyboardArrowDown className="text-gray-500 h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`transition-max-height duration-500 ease-in-out ${
          isVisible
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {discussions.map((discussion, index) => (
            <DiscussionCard
              key={index}
              discussion={discussion}
              //refetchClassDiscussions={refetchClassDiscussions} // Passing the refetch function
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinnedDiscussions;
