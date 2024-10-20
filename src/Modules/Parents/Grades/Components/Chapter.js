import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaEye,
} from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import ChapterItem from "./ChapterItem";

const Chapter = ({ title, chapterNumber, imageUrl, assignments, quizzes, attachments }) => {
  const [chapterExpanded, setChapterExpanded] = useState(false);

  const toggleChapter = () => {
    setChapterExpanded((prev) => !prev);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "application/pdf":
        return <FaFilePdf className="text-red-500" size={24} />;
      case "application/msword":
        return <FaFileWord className="text-blue-500" size={24} />;
      case "application/vnd.ms-powerpoint":
        return <FaFilePowerpoint className="text-orange-500" size={24} />;
      default:
        return null;
    }
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
          {/* Attachments Icon */}
          <button
            className="border p-2 rounded-full hover:bg-gray-100 text-red-600 relative"
            aria-label="View Attachments"
          >
            <GrAttachment />
            {attachments?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-100 opacity-90 text-red-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {attachments.length}
              </span>
            )}
          </button>

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
          {/* Attachments Section */}
          {attachments?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-600">
                Attachments ({attachments.length})
              </h3>
              <div className="grid grid-cols-1 gap-2 mb-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md hover:shadow-md"
                  >
                    <div className="flex items-center">
                      {getFileIcon(attachment.type) || (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="h-8 w-8 object-cover rounded-md"
                        />
                      )}
                      <div className="flex flex-col ml-4">
                        <p className="text-gray-700 text-sm truncate max-w-xs overflow-hidden whitespace-nowrap">
                          {attachment.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Preview clicked")}
                      className="text-green-500 p-1 border rounded-full hover:scale-110 cursor-pointer"
                      aria-label="Preview Attachment"
                    >
                      <FaEye size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
