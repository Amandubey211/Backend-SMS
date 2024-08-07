import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAssignedStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]); // Local state for students
  const role = useSelector((store) => store.Auth.role);

  const fetchAssignedStudents = useCallback(
    async (assignmentId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/speed_grade/students/${assignmentId}`,
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.success) {
          setStudents(response.data.data); // Store the students in local state
          return response.data.data;
        } else {
          toast.error(
            response.data.message ||
              "Failed to fetch students. Please try again."
          );
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

  return { loading, error, students, fetchAssignedStudents };
};

export default useGetAssignedStudents;
