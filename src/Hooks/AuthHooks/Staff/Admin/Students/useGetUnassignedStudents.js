import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetUnassignedStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchUnassignedStudents = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${API_URL}/admin/unassignedStudent/${classId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        if (response.data.status) {
          console.log(response.data)
          return response.data?.data;
        } else {
          toast.error("Please try again");
          return [];
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch unassigned students";
        toast.error(errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL, role]
  );

  return { loading, error, fetchUnassignedStudents };
};

export default useGetUnassignedStudents;
