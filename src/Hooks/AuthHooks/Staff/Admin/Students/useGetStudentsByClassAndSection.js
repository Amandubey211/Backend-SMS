import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetStudentsByClassAndSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const fetchStudentsByClassAndSection = useCallback(
    async (id) => {
      console.log(id, "Frontend");
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/student/${id}`, {
          headers: { Authentication: token },
        });
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
    [baseUrl, role]
  );

  return { loading, error, fetchStudentsByClassAndSection };
};

export default useGetStudentsByClassAndSection;
