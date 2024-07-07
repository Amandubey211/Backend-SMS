import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import FormData from "form-data";

const useCreateSyllabus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const createSyllabus = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();

        for (const key in data) {
          formData.append(key, data[key]);
        }

        const response = await axios.post(
          `${API_URL}/admin/syllabus`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token,
            },
          }
        );
        console.log(response.data.data);
        if (response.data.status) {
          toast.success("Syllabus created successfully!");
        } else {
          toast.error("Syllabus Not Created");
        }
        return response.data.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create syllabus";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, createSyllabus };
};

export default useCreateSyllabus;
