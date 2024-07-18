import { useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetAttendanceByClassSectionGroupAndDate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const cache = useRef({});

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAttendance = useCallback(
    async (classId, sectionId, groupId, month, year) => {
      console.log(classId, sectionId, groupId, month, year);
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${API_URL}/api/teacher/attendance/get`,
          {
            headers: { Authentication: token },
            params: { classId, sectionId, groupId, month, year },
          }
        );
        if (response.data) {
          setAttendanceData(response.data);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch attendance records";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, attendanceData, fetchAttendance };
};

export default useGetAttendanceByClassSectionGroupAndDate;
