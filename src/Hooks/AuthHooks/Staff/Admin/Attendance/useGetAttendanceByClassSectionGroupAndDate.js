import { useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetAttendanceByClassSectionGroupAndDate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStat, setAttendanceStat] = useState([]);
  const cache = useRef({});

  const role = useSelector((store) => store.Auth.role);
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const fetchAttendance = useCallback(
    async (classId, sectionId, groupId, month, year) => {
      console.log(classId, sectionId, groupId, month, year);
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/api/teacher/attendance/getStudentMonthList/${classId}`,
          {
            headers: { Authentication: token },
            params: { sectionId, groupId, month, year },
          }
        );
        if (response.data) {
          setAttendanceData(response.data?.attendanceList);
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
    async (classId, date, sectionId, groupId) => {
      setLoading(true);
      setError(null);
      console.log("classId", classId);
      console.log("date", date);
      const formatedDate = formatDate(date)
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/api/teacher/attendance/getStudentList/${classId}`,
          {
            headers: { Authentication: token },
            params: { date: formatedDate, sectionId, groupId },
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

  const fetchAttendanceStats = useCallback(
    async (classId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/api/teacher/attendance/getAttendanceStats/${classId}`,
          {
            headers: { Authentication: token }
          }
        );
        if (response.data) {
          setAttendanceStat(response.data);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch attendance stat";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [role, baseUrl]
  )

  return { loading, error, attendanceData, attendanceStat, fetchAttendance, fetchAttendanceByClass, fetchAttendanceStats };
};

export default useGetAttendanceByClassSectionGroupAndDate;
