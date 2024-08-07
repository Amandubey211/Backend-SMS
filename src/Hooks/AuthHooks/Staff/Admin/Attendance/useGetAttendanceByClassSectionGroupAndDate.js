import { useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAttendanceByClassSectionGroupAndDate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const cache = useRef({});

  const role = useSelector((store) => store.Auth.role);


  const fetchAttendance = useCallback(
    async (classId, sectionId, groupId, month, year) => {
      console.log(classId, sectionId, groupId, month, year);
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/api/teacher/attendance/get`,
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
    [role, baseUrl]
  );

  const fetchAttendanceByClass = useCallback(
    async (classId, date) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/api/teacher/attendance/getStudentList/${classId}`,
          {
            headers: { Authentication: token },
            params: { date },
          }
        );
        if (response.data) {
          setAttendanceData(response.data);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch attendance records";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [role, baseUrl]
  )


  return { loading, error, attendanceData, fetchAttendance, fetchAttendanceByClass };
};

export default useGetAttendanceByClassSectionGroupAndDate;
