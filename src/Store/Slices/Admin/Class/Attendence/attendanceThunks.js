import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Utility to format date for handling API errors and consistency
const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    console.warn("Invalid date value:", date);
    return new Date().toISOString().split("T")[0]; // Return current date if invalid
  }
  return parsedDate.toISOString().split("T")[0]; // Format valid date to YYYY-MM-DD
};

// Helper function to get the token from the Redux state
const getToken = (state) => {
  const token = state.common.auth?.token;
  if (!token) {
    throw new Error("Authentication token is missing.");
  }
  return `Bearer ${token}`;
};

// Fetch attendance data by class, section, group, and date
export const fetchAttendanceByClassSectionGroupDate = createAsyncThunk(
  "attendance/fetchAttendance",
  async (
    { classId, sectionId, groupId, date },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getToken(getState()); // Fetch token from Redux state
      const formattedDate = formatDate(date); // Format the date before sending

      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getStudentList/${classId}`,
        {
          headers: { Authentication: token }, // Use token in the request headers
          params: { sectionId, groupId, date: formattedDate }, // Send the formatted date and filters
        }
      );

      return response.data; // Return the response data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendance records";
      toast.error(errorMessage); // Show toast notification for error
      return rejectWithValue(errorMessage); // Reject with the error message
    }
  }
);

// Mark attendance
export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState()); // Fetch token from Redux state
      const formattedDate = formatDate(attendanceData.date); // Format the date

      const response = await axios.post(
        `${baseUrl}/api/teacher/attendance/mark`,
        { ...attendanceData, date: formattedDate }, // Ensure the date is in the correct format
        {
          headers: { Authentication: token }, // Use token in the request headers
        }
      );

      toast.success("Attendance marked successfully"); // Show success notification
      return response.data; // Return the response data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark attendance";
      toast.error(errorMessage); // Show toast notification for error
      return rejectWithValue(errorMessage); // Reject with the error message
    }
  }
);

// Fetch attendance stats
export const fetchAttendanceStats = createAsyncThunk(
  "attendance/fetchAttendanceStats",
  async (classId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState()); // Fetch token from Redux state

      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getAttendanceStats/${classId}`,
        {
          headers: { Authentication: token }, // Use token in the request headers
        }
      );

      return response.data; // Return the response data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendance stats";
      toast.error(errorMessage); // Show toast notification for error
      return rejectWithValue(errorMessage); // Reject with the error message
    }
  }
);

// Fetch students' monthly attendance list by class, section, group, year, and month
export const fetchStudentsMonthAttendanceList = createAsyncThunk(
  "attendance/fetchStudentsMonthAttendanceList",
  async (
    { classId, sectionId, groupId, year, month }, // Expecting classId, sectionId, groupId, year, and month
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getToken(getState()); // Fetch token from Redux state

      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getStudentMonthList/${classId}`,
        {
          headers: { Authentication: token }, // Use token in the request headers
          params: { sectionId, groupId, year, month }, // Pass sectionId, groupId, year, and month as query params
        }
      );

      return response.data; // Return the response data (attendanceList)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch students' monthly attendance records";
      toast.error(errorMessage); // Show toast notification for error
      return rejectWithValue(errorMessage); // Reject with the error message
    }
  }
);
