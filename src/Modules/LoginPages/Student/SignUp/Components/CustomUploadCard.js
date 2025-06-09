import React, { useState, useEffect } from "react";
import { Modal, Button, message, Spin, Tooltip } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import useCloudinaryUpload from "../../../../../Hooks/CommonHooks/useCloudinaryUpload";
import useCloudinaryDeleteByPublicId from "../../../../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

const VALID_TYPES = ["image/jpeg", "image/png", "image/gif"];

const CustomUploadCard = ({
  name,
  form,
  recommendedSize = "300x400",
  width = "w-full",
  height = "h-48",
  required = false,
  profilelink,
  onRemove,
}) => {
  /* -------------------- Hooks -------------------- */
  const { uploadFile, uploading, error, resetUpload } = useCloudinaryUpload(
    process.env.REACT_APP_CLOUDINARY_PRESET,
    "student_profiles"
  );
  const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

  const [publicId, setPublicId] = useState(null);
  const [localFile, setLocalFile] = useState(null);
  const [localURL, setLocalURL] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  /* ----------- Utilities ----------- */
  const extractPublicId = (url = "") => {
    if (typeof url !== "string") return null;
    const parts = url.split("/");
    const idx = parts.findIndex((p) => p === "upload");
    return idx === -1
      ? null
      : parts
          .slice(idx + 2)
          .join("/")
          .split(".")[0];
  };

  /* ----------- Initialise from form field (edit mode) ----------- */
  useEffect(() => {
    // Use profilelink if provided, otherwise fall back to form field value
    const initialImage = profilelink || form.getFieldValue(name);
    if (initialImage) {
      // Handle both string and object formats
      const imageUrl =
        typeof initialImage === "string" ? initialImage : initialImage?.url;
      if (imageUrl) {
        setCurrentImage(imageUrl);
        const id = extractPublicId(imageUrl);
        id && setPublicId(id);
      }
    }
    resetUpload();
  }, [form, name, profilelink, resetUpload]);

  /* ----------- Clean up local object URLs ----------- */
  useEffect(() => {
    return () => {
      if (localURL) URL.revokeObjectURL(localURL);
    };
  }, [localURL]);

  /* -------------------- Handlers -------------------- */
  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      message.error("Only JPG / PNG / GIF allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("File size must be less than 5MB");
      return;
    }

    setLocalFile(file);
    setLocalURL(URL.createObjectURL(file));
  };

  const confirmUpload = async () => {
    if (!localFile) return;
    try {
      if (publicId) await deleteMediaByPublicId(publicId);

      const url = await uploadFile(localFile);
      if (url) {
        const id = extractPublicId(url);
        setPublicId(id);
        setCurrentImage(url);
        form.setFieldValue(name, url); 
        // message.success("Image uploaded ✔");
        setLocalFile(null);
        setLocalURL(null);
      }
    } catch (err) {
      message.error("Upload failed");
      console.error(err);
    }
  };

  const removeUploaded = async () => {
    try {
      if (publicId) await deleteMediaByPublicId(publicId);
      setPublicId(null);
      setCurrentImage(null);
      form.setFieldValue(name, null);
      message.success("Image removed");
      if (onRemove) onRemove(); // Call onRemove callback if provided
    } catch (err) {
      message.error("Remove failed");
      console.error(err);
    }
  };

  const cancelPending = () => {
    setLocalFile(null);
    setLocalURL(null);
  };

  /* -------------------- Render helpers -------------------- */
  const EmptyState = () => (
    <div className="text-center p-4">
      <div className="text-xl">+</div>
      <div>Upload Photo</div>
      <div className="text-xs text-gray-500 mt-1">
        (Recommended {recommendedSize})
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );

  const PendingState = () => (
    <>
      <img
        src={localURL}
        alt="preview"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3">
        <Tooltip title="Upload">
          <Button
            shape="circle"
            type="text"
            icon={<CheckOutlined className="text-white" />}
            onClick={confirmUpload}
            loading={uploading}
          />
        </Tooltip>
        <Tooltip title="Cancel">
          <Button
            shape="circle"
            danger
            type="text"
            icon={<CloseOutlined className="text-white" />}
            onClick={cancelPending}
            disabled={uploading}
          />
        </Tooltip>
      </div>
    </>
  );

  const UploadedState = () => (
    <>
      <img
        src={currentImage}
        alt="Uploaded"
        className="w-full h-full object-cover"
        onClick={() => setPreviewOpen(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Tooltip title="Preview">
          <Button
            shape="circle"
            type="text"
            icon={<EyeOutlined className="text-white" />}
            onClick={() => setPreviewOpen(true)}
          />
        </Tooltip>
        <Tooltip title="Remove">
          <Button
            shape="circle"
            danger
            type="text"
            icon={<DeleteOutlined className="text-white" />}
            onClick={removeUploaded}
            className="ml-2"
          />
        </Tooltip>
      </div>
    </>
  );

  /* -------------------- Main JSX -------------------- */
  return (
    <div className={`${width} ${height}`}>
      <div className="flex flex-col h-full">
        <div
          className={`relative group border-2 border-dashed rounded-md flex items-center justify-center flex-1
          transition-colors overflow-hidden cursor-pointer
          ${
            uploading
              ? "bg-gray-100 border-gray-300"
              : "bg-white hover:border-blue-500"
          }
        `}
        >
          {uploading ? (
            <div className="flex flex-col items-center p-4">
              <Spin size="large" />
              <span className="mt-2 text-sm text-gray-600">Uploading…</span>
            </div>
          ) : localURL ? (
            <PendingState />
          ) : currentImage ? (
            <UploadedState />
          ) : (
            <EmptyState />
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      {/* Full-screen preview */}
      <Modal
        open={previewOpen}
        centered
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width="70%"
        bodyStyle={{ padding: 0 }}
      >
        {currentImage && (
          <img
            src={currentImage}
            alt="preview"
            style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default CustomUploadCard;
