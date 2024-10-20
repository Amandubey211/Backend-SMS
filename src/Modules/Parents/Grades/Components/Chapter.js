import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEye } from "react-icons/fa";
import ChapterItem from "./ChapterItem";

const Chapter = ({ title, chapterNumber, imageUrl, assignments, quizzes }) => {
  const [chapterExpanded, setChapterExpanded] = useState(false);

  const toggleChapter = () => {
    setChapterExpanded((prev) => !prev);
  };

  return (
    <div className="mb-4 p-2 bg-white rounded-lg border-b">
      {/* Chapter Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={`Chapter ${chapterNumber}`}
            className="w-12 h-12 mr-4 rounded-lg"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold text-md">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Dropdown Menu */}
          <button
            className="border p-2 rounded-full hover:bg-gray-100"
            onClick={toggleChapter}
            aria-label="Toggle Chapter"
          >
            {chapterExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Chapter Content */}
      {chapterExpanded && (
        <div className="mt-2">
          {/* Assignments and Quizzes */}
          <div>
            {assignments.length > 0 || quizzes.length > 0 ? (
              <>
                {assignments.map((assignment, index) => (
                  <ChapterItem
                    key={index}
                    type="assignment"
                    title={assignment.title}
                    submitted={assignment.submitted}
                  />
                ))}
                {quizzes.map((quiz, index) => (
                  <ChapterItem
                    key={index}
                    type="quiz"
                    title={quiz.title}
                    submitted={quiz.submitted}
                  />
                ))}
              </>
            ) : (
              <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
                No Assignment or Quiz
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapter;
