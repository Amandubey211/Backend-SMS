import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useMarkAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const markAttendance = useCallback(
    async (attendanceData) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${API_URL}/api/teacher/attendance/mark`,
          attendanceData,
          {
            headers: { Authentication: token },
          }
        );
        if (response.data) {
          toast.success("Attendance recorded successfully");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to mark attendance";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { markAttendance, loading, error };
};

export default useMarkAttendance;
