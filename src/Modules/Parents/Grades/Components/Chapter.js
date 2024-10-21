import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEye } from "react-icons/fa";
import ChapterItem from "./ChapterItem";

const Chapter = ({ title, chapterNumber, imageUrl, assignments, quizzes, attachments = [] }) => {
  const [chapterExpanded, setChapterExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const toggleChapter = () => {
    setChapterExpanded((prev) => !prev);
  };

  const openPreview = (url) => {
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
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

          {/* Attachments (PDF Preview) */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-green-600">Attachments</h3>
              {attachments.map((attachment, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {attachment.type === "application/pdf" && (
                      <>
                        <FaEye size={20} className="mr-2 text-red-500" />
                        <span className="text-gray-700">{attachment.name}</span>
                      </>
                    )}
                  </div>
                  <button
                    className="text-green-500 hover:text-green-600"
                    onClick={() => openPreview(attachment.url)}
                  >
                    <FaEye size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-red-500"
            >
              ✕
            </button>
            <embed
              src={previewUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              className="rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapter;
