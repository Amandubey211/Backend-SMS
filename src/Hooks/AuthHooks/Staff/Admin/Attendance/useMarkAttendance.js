import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useMarkAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const markAttendance = useCallback(
    async (attendanceData) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${baseUrl}/api/teacher/attendance/mark`,
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
    [role, baseUrl]
  );

  return { markAttendance, loading, error };
};

export default useMarkAttendance;
