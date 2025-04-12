import React, { useState, useRef, useEffect } from "react";
import { Modal, message } from "antd";
import { useFormikContext, getIn } from "formik";

const ImageUploader = ({
  name,
  previewTitle = "Image Preview",
  recommendedSize = "300x400px",
  aspectRatio = "aspect-[3/4]",
  width = "w-full",
  height = "h-32",
}) => {
  const { setFieldValue, values } = useFormikContext();
  const fileInputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  // Use Formik's getIn to reliably access nested fields
  const currentFile = getIn(values, name);

  useEffect(() => {
    if (currentFile && currentFile.preview) {
      setLocalPreview(currentFile.preview);
    } else {
      setLocalPreview(null);
    }
  }, [currentFile]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      message.error("Please select a valid image file.");
      return;
    }

    // Create object URL for preview
    const fileURL = URL.createObjectURL(selectedFile);

    // Set both file and preview in Formik
    setFieldValue(name, {
      file: selectedFile,
      preview: fileURL,
    });
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFieldValue(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (currentFile && currentFile.preview) {
      setPreviewVisible(true);
    }
  };

  return (
    <>
      <div
        className={`relative flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors ${width} ${height} ${aspectRatio}`}
        onClick={openFileDialog}
      >
        {currentFile ? (
          <>
            <img
              src={localPreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
              onClick={handlePreview}
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-50"
            >
              Clear
            </button>
          </>
        ) : (
          <div className="text-center p-4">
            <div className="text-xl">+</div>
            <div>Upload Photo</div>
            {recommendedSize && (
              <div className="text-xs text-gray-400 mt-1">
                (Recommended size: {recommendedSize})
              </div>
            )}
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          name={name}
        />
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        title={previewTitle}
        onCancel={() => setPreviewVisible(false)}
      >
        {localPreview && (
          <img alt="upload preview" className="w-full" src={localPreview} />
        )}
      </Modal>
    </>
  );
};

export default ImageUploader;
