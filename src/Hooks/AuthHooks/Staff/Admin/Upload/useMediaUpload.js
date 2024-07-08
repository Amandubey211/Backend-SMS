import { useState, useCallback } from "react";
import axios from "axios";

const useMediaUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadMedia = useCallback(async (file, type) => {
    if (!file) return;
    
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

    try {
      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData
      );
      setLoading(false);
      return response.data.secure_url;
    } catch (err) {
      console.error(`Error uploading ${type} to Cloudinary`, err);
      setError(`Error uploading ${type}. Please try again.`);
      setLoading(false);
      return null;
    }
  }, []);

  return { uploadMedia, loading, error };
};

export default useMediaUpload;
