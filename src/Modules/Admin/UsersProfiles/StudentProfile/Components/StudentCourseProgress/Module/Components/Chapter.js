import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";
import ChapterItem from "./ChapterItem";

const Chapter = ({
  title = "Untitled Chapter",
  chapterNumber = "N/A",
  imageUrl,
  assignments = [],
  quizzes = [],
  attachments = [],
  isExpanded,
  onToggle,
  id
}) => {
  // Combine assignments and quizzes into one array with their types
  const combinedItems = [
    ...assignments?.map((assignment) => ({
      ...assignment,
      type: "assignment",
    })),
    ...quizzes?.map((quiz) => ({
      ...quiz,
      type: "quiz",
    })),
    ...attachments?.map((a) => ({
      ...a,
      type: a?.type,
    })),
  ];
  return (
    <div className="mb-4 p-1 bg-white rounded-lg border-b transition-shadow hover:shadow-md">

      <div className="ml-10 py-2">
        {combinedItems?.length > 0 ? (
          combinedItems?.map((item, index) => (
            <ChapterItem
              key={index}
              type={item?.type}
              title={item?.title || item?.name || "Untitled"}
              url={item?.url || null}
              id={item?._id}
              submitted={item?.submitted}
            />
          ))
        ) : (
          <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
            <AiOutlineFileSearch className="text-[5rem] text-gray-500" />
            No data found
          </p>
        )}
      </div>

    </div>
  );
};

export default Chapter;
