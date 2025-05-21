// src/Hooks/useCloudinaryUpload.jsx

import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Custom hook to handle file uploads to Cloudinary.
 *
 * @param {string} uploadPreset - Your unsigned upload preset.
 * @param {string} folder - (Optional) Folder name in Cloudinary.
 * @returns {object} - { uploadFile, uploading, uploadProgress, uploadedUrl, error, resetUpload }
 */
const useCloudinaryUpload = (uploadPreset, folder = "") => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState(null);

  const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_RAW_UPLOAD_URL;

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return null;

      setUploading(true);
      setUploadProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("resource_type", "raw");
      if (folder) {
        formData.append("folder", folder);
      }

      try {

        const response = await axios.post(CLOUDINARY_URL, formData, {
            
          headers: { "Content-Type": "multipart/form-data", },
          resource_type: "auto" ,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        if (response.data.secure_url) {
          setUploadedUrl(response.data.secure_url);
          toast.success("File uploaded successfully!");
          return response.data.secure_url;
        } else {
          throw new Error("No secure URL returned from Cloudinary.");
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        setError(err.message || "Upload failed.");
        toast.error("File upload failed. Please try again.");
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadPreset, folder, CLOUDINARY_URL]
  );

  const resetUpload = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setUploadedUrl("");
    setError(null);
  }, []);

  return {
    uploadFile,
    uploading,
    uploadProgress,
    uploadedUrl,
    error,
    resetUpload,
  };
};

export default useCloudinaryUpload;
