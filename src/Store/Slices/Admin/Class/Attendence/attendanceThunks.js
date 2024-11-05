import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";

const say = localStorage.getItem("say");

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
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch attendance data by class, section, group, and date
export const fetchAttendanceByClassSectionGroupDate = createAsyncThunk(
  "attendance/fetchAttendance",
  async (
    { classId, sectionId, groupId, date },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
      if (typeof token === "object") return token;
      const say = localStorage.getItem("say")
      const formattedDate = formatDate(date); // Format the date before sending

      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getStudentList/${classId}?say=${say}`,
        {
          headers: { Authentication: token }, // Use token in the request headers
          params: { sectionId, groupId, date: formattedDate }, // Send the formatted date and filters
        }
      );

      return response.data; // Return the response data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

// Mark attendance
export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
      if (typeof token === "object") return token;
      const say = localStorage.getItem("say")
      const formattedDate = formatDate(attendanceData.date); // Format the date

      const response = await axios.post(
        `${baseUrl}/api/teacher/attendance/mark?say=${say}`,
        { ...attendanceData, date: formattedDate }, // Ensure the date is in the correct format
        {
          headers: { Authentication: token }, // Use token in the request headers
        }
      );
        toast.success ('Attendance mark successfully');
      dispatch(setShowError(false));
      return response.data; // Return the response data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

// Fetch attendance stats
export const fetchAttendanceStats = createAsyncThunk(
  "attendance/fetchAttendanceStats",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
      if (typeof token === "object") return token;
      const say = localStorage.getItem("say")

      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getAttendanceStats/${classId}?say=${say}`,
        {
          headers: { Authentication: token }, // Use token in the request headers
        }
      );

      return response.data; // Return the response data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

// Fetch students' monthly attendance list by class, section, group, year, and month
export const fetchStudentsMonthAttendanceList = createAsyncThunk(
  "attendance/fetchStudentsMonthAttendanceList",
  async (
    { classId, sectionId, groupId, year, month }, // Expecting classId, sectionId, groupId, year, and month
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch); // Fetch token from Redux state
      if (typeof token === "object") return token;
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/getStudentMonthList/${classId}?say=${say}`,
        {
          headers: { Authentication: token }, // Use token in the request headers
          params: { sectionId, groupId, year, month }, // Pass sectionId, groupId, year, and month as query params
        }
      );

      return response.data; // Return the response data (attendanceList)
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);
