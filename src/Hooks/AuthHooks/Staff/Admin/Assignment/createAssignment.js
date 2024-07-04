import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useGetClassDetails from "./useGetClassDetails"; // Adjust the import based on your project structure

const useCreateAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchClassDetails } = useGetClassDetails();
  const role = useSelector((store) => store.Auth.role);

  const createAssignment = useCallback(
    async (assignmentData, thumbnailFile) => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);

        let imageUrl = "";

        if (thumbnailFile) {
          const formData = new FormData();
          formData.append("file", thumbnailFile);
          formData.append("upload_preset", "assignments"); // Adjust the upload preset as needed

          const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/upload`, // Replace with your Cloudinary URL
            formData
          );

          imageUrl = cloudinaryResponse.data.secure_url;
        }

        const response = await axios.post(
          `${API_URL}/admin/create_assignment`, // Adjust the API endpoint as needed
          { ...assignmentData, thumbnail: imageUrl },
          {
            headers: { Authentication: token },
          }
        );

        const { data } = response.data;

        fetchClassDetails(assignmentData.classId);
        setLoading(false);
        toast.success("Assignment created successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create assignment";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role, fetchClassDetails]
  );

  return { createAssignment, loading, error };
};

export default useCreateAssignment;
