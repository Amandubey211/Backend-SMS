import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEye, FaFilePdf, FaPaperclip } from "react-icons/fa";
import { MdAssignment, MdQuiz } from "react-icons/md";
import ChapterItem from "./ChapterItem";

const Chapter = ({ title, chapterNumber, imageUrl, assignments, quizzes, attachments = [], moduleName }) => {
  const [chapterExpanded, setChapterExpanded] = useState(false);
  const [focusedSection, setFocusedSection] = useState(null);
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

  const handleAttachmentClick = (e) => {
    e.stopPropagation();
    if (attachments?.length > 0) {
      setChapterExpanded(true);
      setFocusedSection("attachments");
    }
  };

  const handleSectionClick = (section) => {
    setFocusedSection((prev) => (prev === section ? null : section));
  };
  console.log('assignments', assignments);
  console.log('quizzes', quizzes);
  return (
    <div className="mb-5">
      {/* Module Name */}
      {moduleName && (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
          <h1 className="text-lg font-bold text-gray-700">{moduleName}</h1>
        </div>
      )}

      {/* Chapter Header */}
      <div
        className="mb-3 p-3 bg-white rounded-lg border flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
        onClick={toggleChapter}
      >
        <div className="flex items-center">
          <img src={imageUrl} alt={`Chapter ${chapterNumber}`} className="w-14 h-14 mr-4 rounded-lg" />
          <div className="flex flex-col">
            <h2 className="font-semibold text-md">{title}</h2>
            <p className="text-gray-500">Chapter {chapterNumber}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative">
          {/* Show Attachment Icon If Attachments Are Available */}
          {attachments?.length > 0 && (
            <button
              className="p-2 rounded-full border bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all text-red-600 relative"
              onClick={handleAttachmentClick}
              title="View Attachments"
            >
              <FaPaperclip />
              <span className="absolute -top-1 -right-1 bg-red-100 text-red-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {attachments?.length}
              </span>
            </button>
          )}

          {/* Dropdown Button */}
          <button
            className={`p-2 rounded-full border bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all ${
              chapterExpanded ? "rotate-180" : ""
            }`}
            aria-label="Toggle Chapter"
            onClick={(e) => {
              e.stopPropagation();
              toggleChapter();
            }}
          >
            {chapterExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Chapter Content */}
      {chapterExpanded && (
        <div className="mt-2 space-y-3">
          {/* Attachments */}
          <div
            className="p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => handleSectionClick("attachments")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaPaperclip className="text-red-500" />
                <span className="font-medium text-gray-700">
                  Attachments ({attachments?.length})
                </span>
              </div>
              <FaChevronDown className={`transition-transform ${focusedSection === "attachments" ? "rotate-180" : ""}`} />
            </div>

            {focusedSection === "attachments" && attachments?.length > 0 && (
              <div className="mt-3">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    <div className="flex items-center space-x-4">
                      {attachment.type === "application/pdf" && <FaFilePdf className="text-red-500" size={20} />}
                      <span className="text-gray-700 font-semibold">{attachment.label}</span>
                    </div>
                    <button
                      onClick={() => openPreview(attachment.url)}
                      className="text-green-500 p-1 border rounded-full transform hover:scale-110 transition"
                      aria-label="Preview"
                    >
                      <FaEye size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div
            className="p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => handleSectionClick("assignments")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MdAssignment className="text-blue-500" />
                <span className="font-medium text-gray-700">
                  Assignments ({assignments?.length})
                </span>
              </div>
              <FaChevronDown className={`transition-transform ${focusedSection === "assignments" ? "rotate-180" : ""}`} />
            </div>

            {focusedSection === "assignments" && assignments?.length > 0 && (
              <div className="mt-3">
                {assignments.map((assignment, index) => (
                  <ChapterItem key={index} type="assignment" title={assignment.title} submitted={assignment.submitted} dueDate={assignment.dueDate}/>
                ))}
              </div>
            )}
          </div>

          {/* Quizzes */}
          <div
            className="p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => handleSectionClick("quizzes")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MdQuiz className="text-green-500" />
                <span className="font-medium text-gray-700">
                  Quizzes ({quizzes?.length})
                </span>
              </div>
              <FaChevronDown className={`transition-transform ${focusedSection === "quizzes" ? "rotate-180" : ""}`} />
            </div>

            {focusedSection === "quizzes" && quizzes?.length > 0 && (
              <div className="mt-3">
                {quizzes.map((quiz, index) => (
                  <ChapterItem key={index} type="quiz" title={quiz.title} submitted={quiz.submitted} dueDate={quiz.dueDate}/>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
            <button onClick={closePreview} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white">
              ✕
            </button>
            <embed src={previewUrl} type="application/pdf" width="100%" height="600px" className="rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapter;
