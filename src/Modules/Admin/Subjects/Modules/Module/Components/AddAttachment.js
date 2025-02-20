import React, { useState, useRef, useMemo } from "react";
import { RiEyeFill, RiDeleteBin5Line } from "react-icons/ri";
import {
  AiOutlineFilePdf,
  AiOutlineInfoCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { ImSpinner3 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addAttachment } from "../../../../../../Store/Slices/Admin/Class/Module/attachmentThunk";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { Modal, Button, Progress } from "antd";
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG for initial image upload
const UploadSVG = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2_203153)">
      <path
        d="M37.5 20H37.52"
        stroke="#7F7F7F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.25 52.5H15C13.0109 52.5 11.1032 51.7098 9.6967 50.3033C8.29018 48.8968 7.5 46.9891 7.5 45V15C7.5 13.0109 8.29018 11.1032 9.6967 9.6967C11.1032 8.29018 13.0109 7.5 15 7.5H45C46.9891 7.5 48.8968 8.29018 50.3033 9.6967C51.7098 11.1032 52.5 13.0109 52.5 15V31.25"
        stroke="#7F7F7F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 40.0005L20 27.5005C22.32 25.268 25.18 25.268 27.5 27.5005L37.5 37.5005"
        stroke="#7F7F7F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 35.0001L37.5 32.5001C39.175 30.8901 41.125 30.4401 42.955 31.1501"
        stroke="#7F7F7F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 47.5H55"
        stroke="#7F7F7F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M47.5 40V55"
        stroke="#7F7F7F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2_203153">
        <rect width="60" height="60" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// Allowed file MIME types and size limit
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];
const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

const AddAttachment = ({ chapterData, onClose }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // overall progress (0-100)
  const [uploading, setUploading] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.module.attachmentLoading);

  // Helper to check if a file is an image
  const isImage = (file) => file && file.type && file.type.startsWith("image/");

  // Get file icon (image preview for images, PDF icon for pdfs)
  const getFileIcon = (file, index) => {
    if (file.type === "application/pdf") {
      return <AiOutlineFilePdf size={30} />;
    } else if (isImage(file)) {
      return (
        <img
          src={previews[index]}
          alt="Preview"
          className="h-8 w-8 object-cover rounded-md"
        />
      );
    }
    return <MdOutlineDocumentScanner size={30} />;
  };

  // Validate and add files (for both change and drop)
  const addValidFiles = (incomingFiles) => {
    const validFiles = incomingFiles.filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) && file.size <= FILE_SIZE_LIMIT
    );
    const invalidTypeFiles = incomingFiles.filter(
      (file) => !ALLOWED_TYPES.includes(file.type)
    );
    const invalidSizeFiles = incomingFiles.filter(
      (file) => file.size > FILE_SIZE_LIMIT
    );

    if (invalidTypeFiles.length > 0) {
      toast.error(
        "Some files have invalid file types (only images and PDFs allowed)."
      );
    }
    if (invalidSizeFiles.length > 0) {
      toast.error("Some files exceed the 10MB limit and were not added.");
    }
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [
        ...prev,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setLabels((prev) => [...prev, ...validFiles.map(() => "")]);
    }
  };

  // File input change
  const handleFileChange = (e) => {
    if (loading || uploading) return;
    const selected = Array.from(e.target.files);
    addValidFiles(selected);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!loading && !uploading) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (loading || uploading) return;
    const dropped = Array.from(e.dataTransfer.files);
    addValidFiles(dropped);
  };

  // Remove file from list
  const handleRemoveFile = (index) => {
    if (loading || uploading) return;
    const removed = {
      file: files[index],
      preview: previews[index],
      label: labels[index],
      index,
    };
    setLastRemoved(removed);
    // Remove file data
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setLabels((prev) => prev.filter((_, i) => i !== index));
    toast((t) => (
      <span>
        File removed.{" "}
        <button
          onClick={() => {
            toast.dismiss(t.id);
            handleUndoRemove();
          }}
          className="text-blue-500 underline ml-2"
        >
          Undo
        </button>
      </span>
    ));
  };

  // Undo removal without closing the sidebar
  const handleUndoRemove = () => {
    if (lastRemoved) {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(lastRemoved.index, 0, lastRemoved.file);
        return newFiles;
      });
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews.splice(lastRemoved.index, 0, lastRemoved.preview);
        return newPreviews;
      });
      setLabels((prev) => {
        const newLabels = [...prev];
        newLabels.splice(lastRemoved.index, 0, lastRemoved.label);
        return newLabels;
      });
      setLastRemoved(null);
    }
  };

  // Preview file
  const handlePreviewFile = (index) => {
    if (loading || uploading) return;
    setSelectedPreview(previews[index]);
    setPreviewModalOpen(true);
  };

  // Handle label change
  const handleLabelChange = (e, index) => {
    const updated = [...labels];
    updated[index] = e.target.value;
    setLabels(updated);
  };

  // Compute overall progress (for demo, we simulate progress)
  // For demo, we'll simulate progress as 100% if "uploading" is true.
  const overallProgress = uploading ? 100 : 0;

  // Handle upload submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || uploading) return;
    if (files.length === 0) {
      toast.error("Please select at least one valid file.");
      return;
    }
    setUploading(true);
    // Show progress on button (simulate a 2-second upload)
    // In real life, dispatch your thunk and track progress via events.
    const simulateUpload = new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
    await dispatch(
      addAttachment({
        chapterId: chapterData.chapterId,
        subjectId: chapterData.sid,
        documents: files,
        documentLabels: labels,
      })
    );
    await simulateUpload;
    setUploading(false);
    // Optionally call onClose here if needed:
    // onClose();
  };

  // File card variants for animation (Framer Motion)
  const cardVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  // Calculate average progress if needed (for multiple files, here we use overall state)
  // For demo, we simply use the "uploading" state.

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.UPLOAD_CHAPTER_FILES}
      title={"Add Attachment"}
    >
      <div className="h-full flex flex-col relative">
        {/* Form Area */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow p-2 space-y-4"
        >
          {/* Drag & Drop / Browse Area */}
          <div
            className={`relative flex flex-col items-center justify-center py-4 h-40 border-2 border-dashed rounded-md transition duration-500 ease-in-out ${
              loading || uploading
                ? "bg-gray-200 cursor-not-allowed"
                : dragActive
                ? "border-indigo-500 bg-gray-100"
                : "border-gray-300 hover:border-indigo-500 hover:bg-gray-100"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!loading && !uploading) fileInputRef.current.click();
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !loading && !uploading)
                fileInputRef.current.click();
            }}
            aria-label="Drag and drop files here or click to browse"
          >
            <div className="relative">
              <UploadSVG />
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={loading || uploading}
              />
            </div>
            <p className="mt-2 text-gray-500">
              Drag & Drop or Click to Browse Files
            </p>
            <p className="text-gray-400">
              Allowed: Images (JPG/PNG) &amp; PDF | Max size: 10MB
            </p>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="flex-grow overflow-y-auto mt-2">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`flex flex-col p-2 border rounded-md mb-2 ${
                      file.size > FILE_SIZE_LIMIT
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(file, index)}
                        <div className="ml-4">
                          <p
                            className="text-gray-700 text-sm truncate max-w-xs"
                            title={file.name}
                          >
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
                          onClick={() => handlePreviewFile(index)}
                          className="p-1 border rounded-full text-blue-500 hover:scale-110 transition"
                          disabled={loading || uploading}
                          aria-label="Preview file"
                        >
                          <RiEyeFill size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 border rounded-full text-red-500 hover:scale-110 transition"
                          disabled={loading || uploading}
                          aria-label="Remove file"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        disabled={
                          loading || uploading || file.size > FILE_SIZE_LIMIT
                        }
                        aria-label="Document label"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </form>

        {/* Upload Button (Fixed at bottom) */}
        <div className="sticky bottom-0 bg-white p-2">
          <Button
            type="primary"
            block
            onClick={handleSubmit}
            disabled={loading || uploading || files.length === 0}
          >
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <Progress
                  percent={overallProgress}
                  size="small"
                  showInfo={false}
                  strokeColor="#fff"
                  className="w-20"
                />
                <span>Uploading...</span>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center">
                <ImSpinner3 size={20} className="animate-spin mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              "Upload Attachments"
            )}
          </Button>
        </div>

        {/* Preview Modal using Ant Design */}
        <Modal
          visible={previewModalOpen}
          onCancel={() => setPreviewModalOpen(false)}
          footer={null}
          centered
          destroyOnClose
          aria-label="File preview modal"
        >
          {selectedPreview &&
            (isImage(files[previews.indexOf(selectedPreview)]) ? (
              <img
                src={selectedPreview}
                alt="Preview"
                className="w-full max-h-[80vh] object-contain rounded-md"
              />
            ) : (
              <embed
                src={selectedPreview}
                type="application/pdf"
                className="w-full max-h-[80vh] rounded-md"
              />
            ))}
        </Modal>

        {/* Guidelines Modal using Ant Design */}
        <Modal
          visible={guideModalOpen}
          onCancel={() => setGuideModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setGuideModalOpen(false)}>
              Close
            </Button>,
          ]}
          title="Attachment Upload Guidelines"
          centered
          destroyOnClose
          aria-label="Attachment guidelines modal"
        >
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Only upload images (JPG/PNG) or PDF files.</li>
            <li>Maximum file size is 10MB per file.</li>
            <li>Labels are optional but help identify the documents.</li>
            <li>You can reorder files using drag & drop or arrow buttons.</li>
            <li>You can preview and remove files before uploading.</li>
            <li>Click “Upload Attachments” to finalize the process.</li>
          </ul>
        </Modal>

        {/* Top Bar with Guidelines Button */}
        <div className="absolute top-0 right-0 p-2">
          <Button
            type="link"
            onClick={() => setGuideModalOpen(true)}
            className="flex items-center text-blue-600"
            aria-label="Open attachment guidelines"
          >
            <AiOutlineInfoCircle size={20} />
            <span className="ml-1">Guidelines</span>
          </Button>
        </div>
      </div>
    </ProtectedSection>
  );
};

export default AddAttachment;
