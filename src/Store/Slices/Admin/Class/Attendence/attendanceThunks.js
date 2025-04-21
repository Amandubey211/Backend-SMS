import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import { getData, postData } from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

// Utility to format date for handling API errors and consistency
const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    console.warn("Invalid date value:", date);
    return new Date().toISOString().split("T")[0]; // Return current date if invalid
  }
  return parsedDate.toISOString().split("T")[0]; // Format valid date to YYYY-MM-DD
};

// Fetch attendance data by class, section, group, and date
export const fetchAttendanceByClassSectionGroupDate = createAsyncThunk(
  "attendance/fetchAttendance",
  async (
    { classId, sectionId, groupId, date },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const formattedDate = formatDate(date); // Format the date before sending

      const response = await getData(
        `/${getRole}/attendance/getStudentList/${classId}?say=${say}`,

        { sectionId, groupId, date: formattedDate } // Send the formatted date and filters
      );

      return response; // Return the response data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

// Mark attendance
export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (attendanceData, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const formattedDate = formatDate(attendanceData.date); // Format the date

      const response = await postData(
        `${baseUrl}/${getRole}/attendance/mark?say=${say}`,
        { ...attendanceData, date: formattedDate }
      );
      toast.success("Attendance marked ");
      dispatch(setShowError(false));
      return response; // Return the response data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

// Fetch attendance stats
export const fetchAttendanceStats = createAsyncThunk(
  "attendance/fetchAttendanceStats",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();

      const response = await getData(
        `/${getRole}/attendance/getAttendanceStats/${classId}?say=${say}`
      );

      return response; // Return the response data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch students' monthly attendance list by class, section, group, year, and month
export const fetchStudentsMonthAttendanceList = createAsyncThunk(
  "attendance/fetchStudentsMonthAttendanceList",
  async (
    { classId, sectionId, groupId, year, month },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/attendance/getStudentMonthList/${classId}?say=${say}`,

        { sectionId, groupId, year, month }
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
