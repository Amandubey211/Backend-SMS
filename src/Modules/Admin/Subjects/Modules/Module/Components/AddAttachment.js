import React, { useState, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiEyeFill, RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineFilePdf } from "react-icons/ai";
import { MdOutlineDocumentScanner } from "react-icons/md";
import useUploadChapterFiles from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useUploadChapterFiles";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const AddAttachment = ({ chapterData, onClose, fetchModules }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB in bytes

  const { loading, uploadChapterFiles } = useUploadChapterFiles(fetchModules);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.size <= FILE_SIZE_LIMIT
    );
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > FILE_SIZE_LIMIT
    );

    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setLabels((prevLabels) => [...prevLabels, ...validFiles.map(() => "")]);
    }

    if (invalidFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...invalidFiles]);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        ...invalidFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setLabels((prevLabels) => [...prevLabels, ...invalidFiles.map(() => "")]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(
      (file) => file.size <= FILE_SIZE_LIMIT
    );
    const invalidFiles = droppedFiles.filter(
      (file) => file.size > FILE_SIZE_LIMIT
    );

    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setLabels((prevLabels) => [...prevLabels, ...validFiles.map(() => "")]);
    }

    if (invalidFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...invalidFiles]);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        ...invalidFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setLabels((prevLabels) => [...prevLabels, ...invalidFiles.map(() => "")]);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    const updatedLabels = [...labels];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    updatedLabels.splice(index, 1);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    setLabels(updatedLabels);
  };

  const handlePreviewFile = (index) => {
    setSelectedPreview(previews[index]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSelectFiles = () => {
    fileInputRef.current.click();
  };

  const handleLabelChange = (e, index) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = e.target.value;
    setLabels(updatedLabels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validFiles = files.filter((file) => file.size <= FILE_SIZE_LIMIT);
    if (validFiles.length > 0) {
      await uploadChapterFiles(chapterData.chapterId, validFiles, labels);
    } else {
      toast.error("Please select at least one valid file.");
    }
  };

  const isImage = (file) => {
    return file && file.type.startsWith("image/");
  };

  const getFileIcon = (file, index) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx"].includes(fileExtension)) {
      return <AiOutlineFilePdf size={30} />;
    } else if (isImage(file)) {
      return (
        <img
          src={previews[index]}
          alt="Preview"
          className="h-8 w-8 object-cover rounded-md"
        />
      );
    } else {
      return <MdOutlineDocumentScanner size={30} />;
    }
  };

  return (
    <div className="h-full flex flex-col ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between h-full p-2"
      >
        <div
          className="flex flex-col px-6 items-center justify-center py-2  h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 hover:bg-gray-100 transition duration-500 ease-in-out "
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleSelectFiles}
        >
          <IoCloudUploadOutline
            size={50}
            className="text-gray-400 my-2 animate-bounce transition"
          />
          <p className="text-gray-500">Drag & Drop or Click to Browse Files</p>
          <p className="text-gray-400">Select single or multiple files</p>
          <p className="text-gray-400">Maximum file size: 10MB</p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        {files.length > 0 && (
          <div className="flex-grow overflow-y-auto mt-4 px-3 no-scrollbar">
            <div className="grid grid-cols-1 gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-2 border rounded-md transform transition duration-100 hover:shadow-md ${
                    file.size > FILE_SIZE_LIMIT
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(file, index)}
                      <div className="flex flex-col ml-4">
                        <p className="text-gray-700 text-sm truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        {file.size > FILE_SIZE_LIMIT && (
                          <p className="text-red-500 text-xs">
                            File exceeds the 10MB limit.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="text-blue-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                        onClick={() => handlePreviewFile(index)}
                      >
                        <RiEyeFill size={20} />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 transition p-1 border rounded-full transform hover:scale-110 cursor-pointer"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <RiDeleteBin5Line size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter label for this document (optional)"
                      value={labels[index] || ""}
                      onChange={(e) => handleLabelChange(e, index)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-500 ease-in-out"
                      disabled={file.size > FILE_SIZE_LIMIT}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 mb-8">
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2 px-4 rounded-md hover:from-purple-500 hover:to-pink-500 transition duration-500 ease-in-out transform ${
              loading ? "cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center ">
                <ImSpinner3 size={20} className="animate-spin text-gray-700" />
              </div>
            ) : (
              "Upload Attachments"
            )}
          </button>
        </div>
      </form>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-500 ease-in-out">
          <div className="bg-white p-2 rounded-lg relative max-h-full max-w-3xl w-full overflow-y-auto shadow-lg transform transition-transform duration-500 ease-in-out scale-100">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 px-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-500 ease-in-out shadow-lg"
            >
              ✕
            </button>
            <div className="flex justify-center">
              <div className="overflow-y-auto max-h-[80vh] w-full">
                {selectedPreview &&
                  (isImage(files[previews.indexOf(selectedPreview)]) ? (
                    <img
                      src={selectedPreview}
                      alt="Preview"
                      className="max-h-[80vh] object-contain rounded-md"
                    />
                  ) : (
                    <embed
                      src={selectedPreview}
                      type="application/pdf"
                      width="700"
                      height="800"
                      className="max-h-[80vh] overflow-y-auto rounded-md"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAttachment;
