import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ChapterItem from "./ChapterItem";

const Chapter = ({
  title = "Untitled Chapter",
  chapterNumber = "N/A",
  imageUrl,
  assignments = [],
  quizzes = [],
  attachments=[],
  isExpanded,
  onToggle,
  id
}) => {
  // Combine assignments and quizzes into one array with their types
  const combinedItems = [
    ...assignments.map((assignment) => ({
      ...assignment,
      type: "assignment",
    })),
    ...quizzes.map((quiz) => ({
      ...quiz,
      type: "quiz",
    })),
    ...attachments.map((a) => ({
      ...a,
      type:a?.type,
    })),
  ];

  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b transition-shadow hover:shadow-md">
      {/* Chapter Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {/* Chapter Thumbnail */}
          <img
            src={imageUrl || "https://via.placeholder.com/50"} // Fallback image if imageUrl is missing
            alt="Chapter Thumbnail"
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className="border p-2 rounded-full hover:bg-gray-50"
          onClick={onToggle}
          aria-expanded={isExpanded === id}
          aria-label={isExpanded === id ? "Collapse chapter" : "Expand chapter"}
        >
          {isExpanded === id ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded === id && (
        <div className="ml-10 py-2">
          {combinedItems.length > 0 ? (
            combinedItems.map((item, index) => (
              <ChapterItem
                key={index}
                type={item?.type}
                title={item?.title ||item?.name || "Untitled"}
                url={item?.url || null}
                id={item?._id}
                submitted={item?.submitted}
              />
            ))
          ) : (
            <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
              No data found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Chapter;
