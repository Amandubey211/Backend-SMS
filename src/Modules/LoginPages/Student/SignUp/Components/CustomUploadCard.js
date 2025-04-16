import { Modal } from "antd";
import React, { useRef, useState } from "react";

const CustomUploadCard = ({
  name,
  label,
  form,
  recommendedSize = "500x500",
  width = "w-full",
  height = "h-52",
  aspectRatio = "aspect-square",
}) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const fileInputRef = useRef(null);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      form.setFieldsValue({ [name]: file });
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setCurrentFile(null);
    setLocalPreview(null);
    form.setFieldsValue({ [name]: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (localPreview) {
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
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          name={name}
          style={{ display: "none" }}
        />
      </div>
      <Modal
        open={previewVisible}
        footer={null}
        title="Preview"
        onCancel={() => setPreviewVisible(false)}
      >
        {localPreview && (
          <img alt="upload preview" className="w-full" src={localPreview} />
        )}
      </Modal>
    </>
  );
};

export default CustomUploadCard;
