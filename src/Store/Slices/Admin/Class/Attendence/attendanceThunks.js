import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Fetch attendance data by class, section, group, and date
export const fetchAttendanceByClassSectionGroupDate = createAsyncThunk(
  "attendance/fetchAttendance",
  async (
    { classId, sectionId, groupId, date },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getStudentList/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
          params: { sectionId, groupId, date },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendance records";
      return rejectWithValue(errorMessage);
    }
  }
);

// Mark attendance
export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.post(
        `${baseUrl}/api/teacher/attendance/mark`,
        attendanceData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Attendance recorded successfully");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark attendance";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchAttendanceStats = createAsyncThunk(
  "attendance/fetchAttendanceStats",
  async (classId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getAttendanceStats/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendance stats";
      return rejectWithValue(errorMessage);
    }
  }
);
