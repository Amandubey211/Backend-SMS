import React, { useState } from "react";
import {
  FaFileAlt,
  FaQuestionCircle,
  FaCheckCircle,
  FaEye,
  FaFilePdf,
} from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";
import { RiListCheck3, RiFileUnknowLine } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { format } from "date-fns"; // Import date formatting
import { IoCalendarOutline } from "react-icons/io5"; 

// Function to get the correct icon based on the item type
const getIcon = (type) => {
  switch (type) {
    case "assignment":
      return <RiListCheck3 className="text-green-500" />;
    case "quiz":
      return <RiFileUnknowLine className="text-green-500" />;
    case "page":
      return <FiFileText className="text-green-500" />;
    case "discussions":
      return <FaQuestionCircle className="text-green-500" />;
    case "pdf":
      return <FaFilePdf className="text-red-500" size={24} />;
    default:
      return null;
  }
};

const ChapterItem = ({ type, title, submitted, dueDate, attachmentUrl }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewOpen = () => {
    setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  // Format due date properly if available (only for quizzes and assignments)
  const formattedDueDate =
    dueDate && (type === "quiz" || type === "assignment")
      ? format(new Date(dueDate), "MMMM dd, yyyy")
      : null;

  return (
    <div className="flex items-center mb-3 gap-3 rounded-lg">
      <div className="p-2 bg-white rounded-full">{getIcon(type)}</div>
      <div className="flex flex-col gap-1 justify-center flex-grow">
        <p className="font-semibold">{title}</p>

        {/* Show Due Date only for Quizzes & Assignments */}
        {formattedDueDate && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <IoCalendarOutline className="text-gray-500" size={16} />
            <span>{formattedDueDate}</span>
          </div>
        )}
      </div>

      {type === "pdf" && (
        <button
          className="text-green-500 hover:text-green-600"
          onClick={handlePreviewOpen}
        >
          <FaEye size={20} />
        </button>
      )}

      <div className="flex items-center gap-1 text-gray-500 justify-center">
        Submit: {submitted ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <MdOutlineBlock className="text-red-500" />
        )}
      </div>

      {/* PDF Preview Modal */}
      {isPreviewOpen && attachmentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
            <button
              onClick={handlePreviewClose}
              className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 focus:outline-none"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                fontSize: "20px",
              }}
            >
              ✕
            </button>
            <embed
              src={attachmentUrl}
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

export default ChapterItem;
