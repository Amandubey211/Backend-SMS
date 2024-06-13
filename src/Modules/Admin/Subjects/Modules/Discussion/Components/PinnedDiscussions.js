import React, { useState } from "react";
import DiscussionCard from "./DiscussionCard";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"; // Import the arrow icons
import { TbPin } from "react-icons/tb";


const PinnedDiscussions = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
const dummyPinnedData = [
  {
    id: 431,
    title: "Discussion Next Exam",
    lastPostDate: "10/02/2024",
    lastPostTime: "12:30 PM",
    unreadReplies: 4,
    replies: 2,
  },
  {
    id: 452,
    title: "Project Ideas for Next Semester",
    lastPostDate: "11/03/2024",
    lastPostTime: "01:00 PM",
    unreadReplies: 3,
    replies: 5,
  },
  {
    id: 333,
    title: "Sustainable Development Goals",
    lastPostDate: "12/04/2024",
    lastPostTime: "02:15 PM",
    unreadReplies: 2,
    replies: 7,
  },
];



  return (
    <div className="w-full p-3 ">
      <div className="flex justify-between items-center mb-4">
        <div
          className="text-xl  flex items-center gap-1"
          onClick={toggleVisibility}
        >
          <TbPin className="text-green-500 text-xl" />
          <span>Pinned Discussion</span>
          <button onClick={toggleVisibility}>
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
          {dummyPinnedData.map((discussion, index) => (
            <DiscussionCard key={index} discussion={discussion} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinnedDiscussions;
