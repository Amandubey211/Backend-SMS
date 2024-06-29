import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetStudentsByClassAndSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchStudentsByClassAndSection = useCallback(
    async (id) => {
      console.log(id,"Frontend")
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${API_URL}/admin/student/${id}`, {
          headers: { Authentication: token },
        });
        console.log(response.data)
        if (response.data.status) {
          return response.data?.data;
        } else {
          toast.error("Failed to fetch students. Please try again.");
          return [];
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch students";
        toast.error(errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL, role]
  );

  return { loading, error, fetchStudentsByClassAndSection };
};

export default useGetStudentsByClassAndSection;
