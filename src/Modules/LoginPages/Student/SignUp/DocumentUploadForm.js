import React, { useState } from "react";
import { LuLoader } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEdit, AiOutlineFilePdf } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDoneOutline, MdOutlineDocumentScanner } from "react-icons/md";
import toast from "react-hot-toast";

const DocumentUploadForm = ({
  studentDocuments,
  handleChange,
  handleFileUploadIconClick,
  handlePhotoChange,
  handleClearPhoto,
  preview,
  setPreview,
  setStudentDocuments,
  fileInputRef,
  handleDocumentSubmit,
  docloading,
  type = "Student",
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const openModal = (preview) => {
    setSelectedPreview(preview);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const isImage = (file) => {
    if (!file) {
      console.error("isImage called with undefined file:", file);
      return false;
    }
    return typeof file === "string" && file.startsWith("data:image");
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...studentDocuments.documents];
    const updatedPreviews = [...preview];

    updatedDocuments.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setPreview(updatedPreviews);
    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: updatedDocuments,
    }));
  };

  const handleLabelChange = (e, index) => {
    const updatedDocuments = [...studentDocuments.documents];
    updatedDocuments[index].label = e.target.value;

    setStudentDocuments((prevState) => ({
      ...prevState,
      documents: updatedDocuments,
    }));
  };

  const handleEditDocument = (index) => {
    setEditIndex(index);
  };

  const handleEditSave = () => {
    setEditIndex(null);
  };

  const getFileIcon = (file, index) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx"].includes(fileExtension)) {
      return <AiOutlineFilePdf size={30} />;
    } else if (isImage(preview[index])) {
      return (
        <img
          src={preview[index]}
          alt="Preview"
          className="h-8 w-8 object-cover rounded-md"
        />
      );
    } else {
      return <MdOutlineDocumentScanner size={30} />;
    }
  };

  return (
    <form onSubmit={handleDocumentSubmit}>
      <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
      <div className="grid grid-cols-1 gap-4">
        {studentDocuments.documents.map((doc, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-lg transition duration-500 ease-in-out flex items-center"
          >
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <select
                  name="documentLabels"
                  value={doc.label || ""}
                  onChange={(e) => handleLabelChange(e, index)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-500 ease-in-out"
                  required
                  disabled={editIndex !== index}
                >
                  <option value="" disabled>
                    Select Document Type
                  </option>
                  <option value="Passport">Passport</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex space-x-2 ml-4">
                  {editIndex === index ? (
                    <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition duration-500 ease-in-out">
                      <MdDoneOutline
                        size={20}
                        className="text-green-500"
                        onClick={handleEditSave}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition duration-500 ease-in-out">
                      <AiOutlineEdit
                        size={20}
                        className="hover:text-green-500 transition duration-500 ease-in-out"
                        onClick={() => handleEditDocument(index)}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition duration-500 ease-in-out">
                    <AiOutlineEye
                      size={20}
                      className="hover:text-blue-500 transition duration-500 ease-in-out"
                      onClick={() => openModal(preview[index])}
                    />
                  </div>
                  <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-red-200 transition duration-500 ease-in-out">
                    <RiDeleteBin5Line
                      size={20}
                      className="text-red-500"
                      onClick={() => handleRemoveDocument(index)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center my-2 gap-1 transition duration-500 ease-in-out">
                <div className="mr-4">{getFileIcon(doc.file, index)}</div>
                <div className="flex flex-col items-start">
                  <div className="text-gray-600 text-sm truncate">
                    {doc.file?.name || ""}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {(doc.file?.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {studentDocuments.documents.length < 3 && (
          <div
            onClick={handleFileUploadIconClick}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 hover:bg-gray-100 transition duration-500 ease-in-out"
          >
            <IoCloudUploadOutline size={50} className="text-gray-400 mb-2" />
            <p className="text-gray-500">Browse Files</p>
            <p className="text-gray-400">Drag and drop files here</p>
            <input
              type="file"
              accept=".pdf, .doc, .jpg, .jpeg, .png"
              multiple
              onChange={handlePhotoChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        )}
      </div>

      {type === "Student" && (
        <>
          <div className="flex items-center mb-4 mt-4">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={() => setAcknowledged(!acknowledged)}
              className="mr-2"
              required
            />
            <label className="text-sm">
              I acknowledge that the above information is correct.
            </label>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className={`w-full ${
                docloading ? "cursor-wait" : ""
              } bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center transition duration-500 ease-in-out`}
              disabled={docloading}
            >
              {docloading ? (
                <div className="flex justify-center gap-1">
                  <LuLoader className="animate-spin text-2xl" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Upload Document & Apply"
              )}
            </button>
            )}
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-500 ease-in-out">
          <div className="bg-white p-4 rounded-lg relative max-h-full overflow-y-auto shadow-lg transform transition-transform duration-500 ease-in-out scale-100">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 px-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-500 ease-in-out shadow-lg"
            >
              ✕
            </button>
            <div>
              {selectedPreview &&
                (isImage(selectedPreview) ? (
                  <img
                    src={selectedPreview}
                    alt="Preview"
                    className="max-h-[80vh] object-contain rounded-md"
                  />
                ) : (
                  <embed
                    src={selectedPreview}
                    type="application/pdf"
                    width="600"
                    height="800"
                    className="max-h-[80vh] overflow-y-auto rounded-md"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default DocumentUploadForm;
