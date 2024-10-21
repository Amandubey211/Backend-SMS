import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEye, FaFilePdf } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import ChapterItem from "./ChapterItem";

const Chapter = ({ title, chapterNumber, imageUrl, assignments, quizzes, attachments = [], moduleName }) => {
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

  // Handle the attachment icon click
  const handleAttachmentClick = () => {
    if (attachments.length === 1) {
      openPreview(attachments[0].url); // Open the PDF if there's only one attachment
    } else if (attachments.length > 1) {
      setChapterExpanded(true); // Expand the chapter if more than one attachment
    }
  };

  // Function to truncate lengthy filenames
  const truncateFileName = (name, length = 30) => {
    if (name.length > length) {
      return `${name.substring(0, length)}...`;
    }
    return name;
  };

  return (
    <div>
      {/* Module Name Box */}
      {moduleName && (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
          <h1 className="text-lg font-bold text-gray-700">{moduleName}</h1>
        </div>
      )}

      {/* Chapter Row */}
      <div
        className="mb-3 p-2 bg-white rounded-lg border cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
        onClick={toggleChapter} // Clicking anywhere on the row will toggle the chapter
      >
        {/* Chapter Header */}
        <div className="flex items-center justify-between m-1">
          <div className="flex items-center">
            <img
              src={imageUrl}
              alt={`Chapter ${chapterNumber}`}
              className="w-14 h-14 mr-4 rounded-lg"
            />
            <div className="flex flex-col">
              <h2 className="font-semibold text-md">{title}</h2>
              <p className="text-gray-500">Chapter {chapterNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            {attachments.length > 0 && (
              <div className="relative">
                <button
                  className="border p-2 rounded-full hover:bg-gray-100 text-red-600"
                  aria-label="View Attachments"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click when pin is clicked
                    handleAttachmentClick();
                  }} // Handle click event
                >
                  <GrAttachment />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-100 text-red-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {attachments.length}
                </span>
              </div>
            )}
            {/* Dropdown Menu */}
            <button
              className="border p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle Chapter"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click toggle when button is clicked
                toggleChapter();
              }}
            >
              {chapterExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
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
              <h3 className="text-sm font-semibold text-green-600 mb-2">Attachments ({attachments.length})</h3>
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-3 p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
                >
                  <div className="flex items-center space-x-4">
                    {/* Independent PDF Icon */}
                    {attachment.type === "application/pdf" && (
                      <div className="flex-shrink-0">
                        <FaFilePdf className="text-red-500" size={24} />
                      </div>
                    )}

                    {/* Name and Label in a Column */}
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-semibold">
                        {truncateFileName(attachment.name)}
                      </span>
                      {attachment.label && (
                        <span className="text-gray-500 text-sm italic">
                          {truncateFileName(attachment.label)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview Button */}
                  <button
                    onClick={() => openPreview(attachment.url)}
                    className="text-green-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                    aria-label="Preview"
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
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-500 ease-in-out shadow-lg"
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
