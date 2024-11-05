import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common"; // Importing baseUrl
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state
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

// Fetch Assigned Assignment Students
export const fetchAssignedAssignmentStudents = createAsyncThunk(
  "speedGrade/fetchAssignedAssignmentStudents",
  async (assignmentId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/students/${assignmentId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Student Assignment
export const fetchStudentAssignment = createAsyncThunk(
  "speedGrade/fetchStudentAssignment",
  async ({ studentId, assignmentId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/assignment?say=${say}`,
        {
          headers: { Authentication: token },
          params: { studentId, assignmentId },
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign Assignment Grade
export const assignAssignmentGrade = createAsyncThunk(
  "speedGrade/assignAssignmentGrade",
  async (
    { studentId, assignmentId, grade, attemptDate, status },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.put(
        `${baseUrl}/admin/speed_grade/grade?say=${say}`,
        { studentId, assignmentId, grade, attemptDate, status },
        {
          headers: { Authentication: token },
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
