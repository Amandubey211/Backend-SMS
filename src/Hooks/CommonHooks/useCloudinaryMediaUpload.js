import { useCallback } from "react";
import axios from "axios";

function useCloudinaryMediaUpload() {
  const uploadImage = useCallback(async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      formData.append("folder", "assignments");
      // Request that Cloudinary return a delete token.
      formData.append("return_delete_token", "1");

      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              onProgress(progressEvent);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }, []);

  const uploadFile = useCallback(async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      formData.append("folder", "assignments");
      formData.append("return_delete_token", "1");

      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              onProgress(progressEvent);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  }, []);

  return { uploadImage, uploadFile };
}

export default useCloudinaryMediaUpload;
