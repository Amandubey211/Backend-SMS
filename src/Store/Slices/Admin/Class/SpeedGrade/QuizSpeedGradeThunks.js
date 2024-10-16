import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common"; // Importing baseUrl

export const fetchAssignedQuizStudents = createAsyncThunk(
  "speedGrade/fetchAssignedQuizStudents",
  async (quizId, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(
        `${baseUrl}/admin/speed_grade/quiz/${quizId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

export const fetchStudentQuiz = createAsyncThunk(
  "speedGrade/fetchStudentQuiz",
  async ({ studentId, quizId }, { getState, rejectWithValue }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(`${baseUrl}/admin/speed_grade/quiz`, {
        headers: { Authentication: `Bearer ${token}` },
        params: { studentId, quizId },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch quiz details"
      );
    }
  }
);

export const assignQuizGrade = createAsyncThunk(
  "speedGrade/assignQuizGrade",
  async (
    { studentId, quizId, attemptDate, score, status },
    { getState, rejectWithValue }
  ) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.put(
        `${baseUrl}/admin/speed_grade/quiz/grade`,
        { studentId, quizId, attemptDate, score, status },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to assign quiz grade"
      );
    }
  }
);
