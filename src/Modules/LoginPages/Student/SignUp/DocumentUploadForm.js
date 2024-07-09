import React, { useState } from "react";
import { LuLoader } from "react-icons/lu";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";

const DocumentUploadForm = ({
  studentDocuments,
  handleChange,
  handleFileUploadIconClick,
  handlePhotoChange,
  handleClearPhoto,
  preview,
  fileInputRef,
  handleDocumentSubmit,
  docloading,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const isImage = (file) => {
    return file.startsWith("data:image");
  };

  return (
    <form onSubmit={handleDocumentSubmit}>
      <h3 className="text-lg font-semibold mb-2">Document Upload</h3>
      <div className="mb-4">
        <label className="text-sm">Select Document Type</label>
        <select
          name="documentLabels"
          value={studentDocuments.documentLabels}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="" disabled>
            Select Document Type
          </option>
          <option value="Passport">Passport</option>
          <option value="Birth Certificate">Birth Certificate</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-center">
          {preview ? (
            <div className="relative">
              {isImage(preview) ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 object-contain"
                />
              ) : (
                <embed
                  src={preview}
                  type="application/pdf"
                  width="300"
                  height="200"
                />
              )}
              <button
                title="Clear Photo"
                style={{
                  background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
                  transition: "background-color 0.3s ease",
                  transform: "scale(1)",
                }}
                className="absolute top-1 right-1 hover:border-purple-500 shadow-2xl opacity-85 hover:opacity-100 hover:shadow-2xl hover:border hover rounded-full p-1"
                onClick={handleClearPhoto}
              >
                <span
                  className="p-1"
                  style={{
                    background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    transition: "transform 0.3s ease-in",
                    transform: "scale(1)",
                  }}
                >
                  &#10005;
                </span>
              </button>
              <button
                title="Open Modal"
                style={{
                  background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
                  transition: "background-color 0.3s ease",
                  transform: "scale(1)",
                }}
                className="absolute top-1 right-10 hover:border-purple-500 shadow-2xl opacity-85 hover:opacity-100 hover:shadow-2xl hover:border hover rounded-full p-1"
                onClick={openModal}
              >
                <AiOutlineEye
                  size={25}
                  style={{
                    background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    transition: "transform 0.3s ease-in",
                    transform: "scale(1)",
                  }}
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-52 h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
              <MdOutlineDocumentScanner
                size={50}
                onClick={handleFileUploadIconClick}
                className="text-gray-400"
              />
            </div>
          )}
          <input
            type="file"
            accept=".pdf, .doc, .jpg, .jpeg, .png"
            onChange={handlePhotoChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      </div>
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg relative max-h-full overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-200 shadow-lg"
            >
              ✕
            </button>
            <div>
              {preview &&
                (isImage(preview) ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[80vh] object-contain"
                  />
                ) : (
                  <embed
                    src={preview}
                    type="application/pdf"
                    width="600"
                    height="800"
                    className="max-h-[80vh] overflow-y-auto"
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="text-sm">Document Description</label>
        <input
          type="text"
          name="documentDescriptions"
          value={studentDocuments.documentDescriptions}
          onChange={handleChange}
          placeholder="Document Description"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          className={`w-full ${
            docloading ? "cursor-wait" : ""
          } bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center`}
          disabled={docloading}
        >
          {docloading ? (
            <div className="flex justify-center gap-1  ">
              <LuLoader className="animate-spin text-2xl" />
              <span>Uploading...</span>
            </div>
          ) : (
            "Upload Document"
          )}
        </button>
      </div>
    </form>
  );
};

export default DocumentUploadForm;
