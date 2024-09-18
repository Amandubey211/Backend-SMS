import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAttendanceData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  const role = useSelector((store) => store.common.auth.role);
  

  const fetchAttendanceData = useCallback(async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/dashboard/attendance`, {
        params: { month, year },
        headers: { Authentication: token },
      });

      setAttendanceData(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch attendance data";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [role]);

  return { loading, error, attendanceData, fetchAttendanceData };
};

export default useGetAttendanceData;
