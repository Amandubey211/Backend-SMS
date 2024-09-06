import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaEllipsisV,
  FaEye,
} from "react-icons/fa";
import ChapterItem from "./ChapterItem";

const Chapter = ({
  title,
  chapterNumber,
  imageUrl,
  assignments,
  quizzes,
  attachments = [],
  isExpanded,
  onToggle,
}) => {
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

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

  const toggleAttachments = () => {
    setAttachmentsExpanded((prev) => !prev);
  };

  const openPreviewModal = (url, type, attachment) => {
    console.log("Opening preview for:", attachment); // Console log the attachment
    console.log("Opening preview for:", url); // Console log the attachment
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const closePreviewModal = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "application/pdf":
        return <FaFilePdf className="text-red-500" size={24} />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FaFileWord className="text-blue-500" size={24} />;
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return <FaFilePowerpoint className="text-orange-500" size={24} />;
      default:
        return null;
    }
  };

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
            <div className="flex items-center gap-1">
              <p className="text-gray-500">Chapter {chapterNumber}</p>

              {attachments.length > 0 && (
                <div className="flex items-center justify-between">
                  <button
                    className="flex items-center space-x-1 px-3 text-sm font-semibold bg-gradient-to-r from-pink-100 to-purple-200 rounded-md py-1"
                    onClick={toggleAttachments}
                  >
                    <span className="text-gradient">
                      Attachments ({attachments.length})
                    </span>
                    <span>
                      {attachmentsExpanded ? (
                        <FaChevronUp className="ml-1 text-purple-700" />
                      ) : (
                        <FaChevronDown className="ml-1 text-purple-800" />
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="border p-2 rounded-full hover:bg-gray-50"
            onClick={onToggle}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {attachmentsExpanded && attachments.length > 0 && (
        <div className="mt-2">
          <div className="grid grid-cols-1 gap-2 mb-2">
            {attachments.map((attachment, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col p-2 border rounded-md transform transition duration-100 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(attachment.type) || (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="h-8 w-8 object-cover rounded-md"
                        />
                      )}
                      <div className="flex flex-col ml-4">
                        <p className="text-gray-700 text-sm truncate max-w-xs">
                          {attachment.name}
                        </p>
                        <p className="text-md">{attachment.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          openPreviewModal(
                            attachment.url,
                            attachment.type,
                            attachment
                          )
                        }
                        className="text-green-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                        aria-label="Preview"
                      >
                        <FaEye size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              />
            ))
          ) : (
            <p className="py-2 bg-gray-50 italic text-gray-500 text-center">
              No Data found
            </p>
          )}
        </div>
      )}

      {previewUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closePreviewModal}
          ></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 max-w-3xl w-full p-6 relative">
            <button
              onClick={closePreviewModal}
              className="absolute top-2 right-2 p-2 px-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-500 ease-in-out shadow-lg"
            >
              ✕
            </button>
            <div className="flex justify-center">
              <div className="overflow-y-auto max-h-[80vh] w-full">
                {previewType === "application/pdf" ? (
                  <embed
                    src={previewUrl}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="max-h-[80vh] overflow-y-auto rounded-md"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[80vh] w-full object-contain rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapter;
