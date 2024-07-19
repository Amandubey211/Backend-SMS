import React from "react";
import {
  FaPlus,
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ChapterItem from "./ChapterItem";

const Chapter = ({
  title,
  chapterNumber,
  imageUrl,
  assignments,
  quizzes,
  isExpanded,
  onToggle,
}) => {
  const combinedItems = [
    ...assignments.map((assignment) => ({
      ...assignment,
      type: "assignment",
    })),
    ...quizzes.map((quiz) => ({
      ...quiz,
      type: "quiz",
    })),
  ];

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt="Chapter"
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <button className="border p-2 rounded-full hover:bg-gray-50">
            <FaPlus className="text-pink-500" />
          </button> */}
          <button className="border p-2 rounded-full hover:bg-gray-50">
            <FaEllipsisV />
          </button>
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            onClick={onToggle}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-10 py-2">
          {combinedItems.length > 0 ? (
            combinedItems.map((item, index) => (
              <ChapterItem
                key={index}
                type={item.type}
                title={item.name}
                id={item._id}
                isPublished={item.isPublished}
                // isPublished={index/2 == 0 ? true:false}

              />
            ))
          ) : (
            <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
              No Data found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Chapter;
