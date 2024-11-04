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

// Fetch Assigned Quiz Students
export const fetchAssignedQuizStudents = createAsyncThunk(
  "speedGrade/fetchAssignedQuizStudents",
  async (quizId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/quiz/${quizId}?say=${say}`,
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

// Fetch Student Quiz
export const fetchStudentQuiz = createAsyncThunk(
  "speedGrade/fetchStudentQuiz",
  async ({ studentId, quizId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/quiz?say=${say}`,
        {
          headers: { Authentication: token },
          params: { studentId, quizId },
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign Quiz Grade
export const assignQuizGrade = createAsyncThunk(
  "speedGrade/assignQuizGrade",
  async (
    { studentId, quizId, attemptDate, score, status },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/speed_grade/quiz/grade?say=${say}`,
        { studentId, quizId, attemptDate, score, status },
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
