import React, { useState } from "react";
import { Upload, message, Progress } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

const BulkEntriesModal = ({ visible, onClose }) => {
  const { Dragger } = Upload;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const uploadProps = {
    name: "file",
    multiple: false,
    action: "/upload.do", // Replace with your server upload endpoint
    onChange(info) {
      const { status } = info.file;
      if (status === "uploading") {
        setUploading(true);
      }
      if (status === "done") {
        message.success(`${info.file.name} uploaded successfully.`);
        setUploading(false);
        setUploadProgress(100); // Set to 100% on success
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`);
        setUploading(false);
      }
    },
    onProgress(event) {
      setUploadProgress(Math.round((event.percent || 0) * 100) / 100);
    },
    showUploadList: true, // Enable file list preview
  };

  return (
    <div
      className="fixed -top-6 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]"
    >
      <div className="bg-white rounded-lg w-[500px] shadow-lg overflow-hidden">
        {/* Top Red Strip */}
        <div className="bg-[#C83B62] h-10 flex items-center justify-between px-4">
          <h3 className="text-white font-bold">Bulk entries</h3>
          <button
            className="text-white hover:opacity-80 focus:outline-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Export Button and Category Header in the Same Row */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Category</h3>
            <button
              className="px-4 py-2 bg-[#007BFF] text-white font-bold rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              Download <DownloadOutlined className="ml-2 text-lg" />
            </button>
          </div>

          {/* Upload Section */}
          <Dragger
            {...uploadProps}
            className="border-2 border-dashed border-[#C83B62] bg-white rounded-lg p-0 flex flex-col items-center justify-center"
            style={{
              minHeight: "220px",
              minWidth: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="flex flex-col items-center justify-center">
              {/* Wrapping all children in a flex container */}
              <p className="text-[#C83B62] text-4xl mb-4">
                {/* Icon with margin-bottom */}
                <InboxOutlined />
              </p>
              <p className="font-bold text-gray-800 text-lg mb-2">
                {/* Header text */}
                Upload CSV file
              </p>
              <p className="text-base text-gray-500">
                {/* Description text */}
                Drag and drop your CSV file here or click to browse
              </p>
            </div>
          </Dragger>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <Progress
                percent={uploadProgress}
                status={uploadProgress === 100 ? "success" : "active"}
              />
            </div>
          )}

          {/* Buttons Section */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-[#C83B62] text-[#C83B62] font-bold rounded-lg hover:bg-red-100 hover:text-red-600 transition"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Validate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEntriesModal;
