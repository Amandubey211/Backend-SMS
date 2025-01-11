// src/Components/Admin/Finance/Earnings/Component/FileInput.jsx

import React, { useState, useRef, useEffect } from "react";
import { useField } from "formik";
import { motion } from "framer-motion";
import { IoIosCloudUpload, IoMdClose } from "react-icons/io";
import { Modal, Spin, Button, Tooltip, Badge, Progress } from "antd";
import {
  EyeOutlined,
  FilePdfOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import useCloudinaryUpload from "../../../../../../Hooks/CommonHooks/useCloudinaryUpload";
import toast from "react-hot-toast";

const FileInput = ({ label, name, onChange, value, required = false }) => {
  // Corrected the readOnly selector to reference expenses instead of earnings
  const readOnly = useSelector((state) => state.admin.expenses.readOnly);

  // Use Formik's useField to get meta
  const [field, meta] = useField(name);

  // Cloudinary Configuration
  const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;
  const CLOUDINARY_FOLDER = "expenses"; // Updated folder name for clarity

  // Utilize the custom hook
  const {
    uploadFile,
    uploading,
    uploadProgress,
    uploadedUrl,
    error,
    resetUpload,
  } = useCloudinaryUpload(CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_FOLDER);

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0); // in bytes
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewType, setPreviewType] = useState(""); // 'image' or 'pdf'
  const fileInputRef = useRef(null);

  // Update fileName and fileSize when value prop changes (e.g., when editing and data is preloaded)
  useEffect(() => {
    if (value) {
      setFileName(getFileNameFromUrl(value));
      // Note: File size for preloaded files is not available unless stored separately
      // You can extend the component to accept fileSize as a prop if needed
    } else {
      setFileName("");
      setFileSize(0);
    }
  }, [value]);

  // Helper function to extract file name from URL
  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    const urlSegments = url?.split("/");
    const nameWithParams = urlSegments[urlSegments.length - 1];
    const name = nameWithParams.split("?")[0];
    return name;
  };

  // Handle file selection and upload to Cloudinary
  const handleFileChange = async (event) => {
    if (readOnly) return;
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      const url = await uploadFile(file);
      if (url) {
        onChange({ target: { name, value: url } }); // Update Formik's value
      }
    }
  };

  // Handle file reset
  const handleFileReset = () => {
    if (readOnly) return;
    setFileName("");
    setFileSize(0);
    resetUpload(); // Reset the upload state
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange({ target: { name, value: null } }); // Reset Formik value
  };

  // Determine file type based on URL extension
  const getFileType = (url) => {
    if (!url) return "unsupported";
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
      return "image";
    } else if (["pdf"].includes(extension)) {
      return "pdf";
    } else {
      return "unsupported";
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (!value) return;
    const type = getFileType(value);
    if (type === "unsupported") {
      toast.error("Unsupported file type for preview.");
      return;
    }
    setPreviewType(type);
    setPreviewVisible(true);
  };

  // Close preview modal
  const handleModalClose = () => {
    setPreviewVisible(false);
  };

  // Get file size in readable format
  const getReadableFileSizeString = (fileSizeInBytes) => {
    if (fileSizeInBytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(fileSizeInBytes) / Math.log(k));
    return (
      parseFloat((fileSizeInBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // Get file type icon
  const getFileTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <FileImageOutlined className="text-gray-800 text-2xl" />;
      case "pdf":
        return <FilePdfOutlined className="text-gray-800 text-2xl" />;
      default:
        return <IoIosCloudUpload className="text-gray-700 text-xl" />;
    }
  };

  // Framer Motion variants for error animation
  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      variants={variants}
      initial="hidden"
      animate={meta.touched && meta.error ? "error" : "visible"}
      transition={{ duration: 0.3 }}
    >
      {/* Loading Bar */}
      {uploading && (
        <Progress
          percent={uploadProgress}
          showInfo={false}
          strokeColor={{
            "0%": "#ff4d4f",
            "100%": "#ff7875",
          }}
          className="absolute top-0 left-0 right-0 z-10"
        />
      )}

      <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
        {label}

        {/* {required && <span className="text-red-500">*</span>} */}
      </label>

      <div
        className={`relative bg-white border ${
          meta.touched && meta.error ? "border-red-500" : "border-gray-700"
        } rounded-sm px-4 py-3 flex items-center justify-between shadow-sm ${
          readOnly ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        {/* Left Side: Wrapped in label */}
        <label
          htmlFor={name}
          className="flex items-center gap-2 flex-grow relative z-0"
        >
          {/* File Type Icon */}
          <div className="flex-shrink-0">
            {getFileType(value) !== "unsupported" ? (
              getFileTypeIcon(getFileType(value))
            ) : (
              <IoIosCloudUpload className="text-gray-700 text-xl" />
            )}
          </div>

          {/* File Name and Size */}
          <div className="flex flex-col">
            {/* Truncate file name to 20 characters */}
            <Tooltip title={fileName}>
              <span
                className={`${
                  fileName ? "text-gray-800 font-medium" : "text-gray-400"
                } truncate`}
                style={{ maxWidth: "150px" }}
              >
                {fileName.length > 20
                  ? `${fileName.substring(0, 20)}...`
                  : fileName || "No file selected"}
              </span>
            </Tooltip>
            {/* File Size Badge */}
            {fileSize > 0 && !uploading && (
              <Badge
                count={getReadableFileSizeString(fileSize)}
                style={{ backgroundColor: "#52c41a" }}
              />
            )}
          </div>
        </label>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 relative z-10">
          {value && (
            <>
              {/* Preview Button */}
              <Tooltip title="Preview file">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="text-blue-500 hover:text-blue-700 transition focus:outline-none"
                  aria-label="Preview file"
                >
                  <EyeOutlined className="text-xl" />
                </button>
              </Tooltip>

              {/* Reset Button */}
              {!readOnly && (
                <Tooltip title="Remove file">
                  <button
                    type="button"
                    onClick={handleFileReset}
                    className="text-gray-500 hover:text-red-500 transition focus:outline-none"
                    aria-label="Remove file"
                  >
                    <IoMdClose className="text-xl" />
                  </button>
                </Tooltip>
              )}
            </>
          )}
        </div>

        {/* Hidden File Input */}
        {!readOnly && (
          <input
            ref={fileInputRef}
            id={name}
            name={name}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
          />
        )}
      </div>

      {/* Loading Spinner */}
      {uploading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Spin size="small" />
        </div>
      )}

      {/* Error Message */}
      {meta.touched && meta.error && (
        <div className="text-sm text-red-500 mt-1">
          {meta.error === "Network Error"
            ? "Network error. Please check your connection and try again."
            : meta.error}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        centered
        width={800}
        bodyStyle={{
          backgroundColor: "#fff0f6", // Light pink background
        }}
        style={{
          top: 20,
        }}
        destroyOnClose
      >
        {value && previewType === "image" && (
          <img
            src={value}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        )}
        {value && previewType === "pdf" && (
          <iframe
            src={value}
            title="PDF Preview"
            width="100%"
            height="600px"
          ></iframe>
        )}
      </Modal>
    </motion.div>
  );
};

export default FileInput;
