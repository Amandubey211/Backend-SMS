import React, { useState, useRef } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiEyeFill, RiFileUploadLine } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineFilePdf } from "react-icons/ai"; // Correct import for AiOutlineFilePdf
import { MdOutlineDocumentScanner } from "react-icons/md";
const MediaUpload = ({ onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [skipFiles, setSkipFiles] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB in bytes

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.size <= FILE_SIZE_LIMIT
    );
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > FILE_SIZE_LIMIT
    );

    if (validFiles?.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        ...validFiles?.map((file) => URL.createObjectURL(file)),
      ]);
      setSkipFiles(false); // Hide the checkbox when files are added
    }

    if (invalidFiles?.length > 0) {
      toast.error("Some files exceed the 10MB limit and were not added.");
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handlePreviewFile = (index) => {
    setSelectedPreview(previews[index]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleUploadFiles = async () => {
    if (files?.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;
    const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET;

    if (!cloudinaryUrl || !cloudinaryPreset) {
      setError("Cloudinary URL or preset is not defined");
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all(
        files?.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", cloudinaryPreset);
          return axios.post(cloudinaryUrl, formData);
        })
      );
      const mediaData = responses?.map((res, index) => ({
        url: res.data.secure_url,
        name: files[index].name,
        type: files[index].type,
      }));
      onSubmit(mediaData); // Trigger the parent function for handling uploaded files
      setUploadComplete(true);
      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files to Cloudinary", error);
      setError("Error uploading files. Please try again.");
    } finally {
      setLoading(false);
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
    <div className="w-full p-6 bg-white   ">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload Media
      </label>
      {!files?.length && (
        <div className="flex items-start  mb-4 ">
          <input
            type="checkbox"
            id="skipFiles"
            checked={skipFiles}
            onChange={() => setSkipFiles(!skipFiles)}
            className="mr-2 mt-1"
          />
          <label htmlFor="skipFiles" className="text-sm text-gray-600">
            Skip file submission
          </label>
        </div>
      )}

      {!skipFiles && (
        <>
          <div
            className="flex flex-col items-center justify-center py-2 h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 hover:bg-gray-100 transition duration-500 ease-in-out"
            onClick={() => fileInputRef.current.click()}
          >
            <IoCloudUploadOutline
              size={50}
              className="text-gray-400 my-2 animate-bounce transition"
            />
            <p className="text-gray-500">
              Drag & Drop or Click to Browse Files
            </p>
            <p className="text-gray-400">Maximum file size: 10MB</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>

          {files?.length > 0 && (
            <div className="flex-grow  overflow-y-auto mt-4 px-3 no-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                {files?.map((file, index) => (
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
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {loading ? (
        <div className="flex items-center justify-center mt-3">
          <FaSpinner className="animate-spin mr-2 text-2xl" />
          <span>Uploading...</span>
        </div>
      ) : (
        <>
          {!skipFiles && files?.length > 0 && (
            <button
              onClick={handleUploadFiles}
              className="flex items-center justify-center w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-md shadow-sm hover:from-green-500 hover:to-teal-500 transition duration-500 ease-in-out"
            >
              <RiFileUploadLine className="mr-2" />
              Upload Files
            </button>
          )}
        </>
      )}

      {error && <div className="text-red-500 mt-3">{error}</div>}

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

export default MediaUpload;
