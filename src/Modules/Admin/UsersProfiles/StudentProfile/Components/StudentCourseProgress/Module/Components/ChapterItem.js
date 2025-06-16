import React, { useState } from 'react';
import { FaFileAlt, FaQuestionCircle, FaFile, FaComments, FaCheckCircle, FaEllipsisV, FaEye } from 'react-icons/fa';
import { RiListCheck3, RiFileUnknowLine } from "react-icons/ri";
import { GoDiscussionClosed } from "react-icons/go";
import { FiFileText } from "react-icons/fi";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';

const getIcon = (type) => {
  switch (type) {
    case 'assignment':
      return <RiListCheck3 className="text-green-500" />;
    case 'quiz':
      return <RiFileUnknowLine className="text-green-500" />;
    case 'page':
      return <FiFileText className="text-green-500" />;
    case 'discussions':
      return <GoDiscussionClosed className="text-green-500" />;
    case 'completed':
      return <FaCheckCircle className="text-green-500" />;
    case 'more':
      return <FaEllipsisV className="text-green-500" />;
    default:
      return <FaFileAlt className="text-green-500" />;
  }
};

const ChapterItem = ({ type, title, submitted, url }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const openPreviewModal = (url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const closePreviewModal = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return (
    url !== null ? (
      <div className="flex items-center mb-3 rounded-lg p-2 hover:bg-gray-100 transition-colors">
        <span className="capitalize font-semibold font-roboto text-gray-700 w-24">{type}</span>
        <span className="p-2 bg-white rounded-full">{getIcon(type)}</span>
        <div className="flex flex-col gap-1 justify-center pr-4 flex-grow">
          <span
            className="font-roboto font-semibold text-gray-800 truncate max-w-[200px] cursor-pointer"
            data-tooltip-id={`title-tooltip-${title}`}
            data-tooltip-content={title}
          >
            {title?.slice(0, 30)}
          </span>
          <Tooltip
            id={`title-tooltip-${title}`}
            place="top"
            className="font-roboto bg-gray-800 text-white rounded-md p-2"
          />
        </div>
        <div
          className="flex items-center gap-1 justify-center cursor-pointer"
          onClick={() => openPreviewModal(url, type)}
        >
          <FaEye className="text-pink-500 text-2xl" />
        </div>
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
    ) : (
      <div className="flex items-center mb-3 gap-2 rounded-lg p-2 hover:bg-gray-100 transition-colors">
        <span className="capitalize font-semibold font-roboto text-gray-700 w-24">{type}</span>
        <span className="p-2 bg-white rounded-full">{getIcon(type)}</span>
        <div className="flex flex-col gap-1 justify-center flex-grow">
          <span
            className="font-roboto font-semibold text-gray-800 truncate max-w-[200px] cursor-pointer"
            data-tooltip-id={`title-tooltip-${title}`}
            data-tooltip-content={title}
          >
            {title?.slice(0, 30)}
          </span>
          <Tooltip
            id={`title-tooltip-${title}`}
            place="top"
            className="font-roboto bg-gray-800 text-white rounded-md p-2"
          />
        </div>
        <div className="flex items-center gap-1 text-gray-500 justify-center">
          {submitted ? "Submitted" : "Not Submitted"}:
          {submitted ? <FaCheckCircle className="text-green-500" /> : <AiOutlineCloseCircle className="text-red-500" />}
        </div>
      </div>
    )
  );
};

export default ChapterItem;