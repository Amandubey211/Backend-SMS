import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Helper function to get the token from state
const getToken = (getState) => getState().common.auth.token;

// Thunk to fetch filtered quizzes
export const fetchFilteredQuizzesThunk = createAsyncThunk(
  "quiz/fetchFilteredQuizzes",
  async ({ moduleId, chapterId, publish }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState); // Get token using helper
      const params = {
        ...(moduleId && { moduleId }),
        ...(chapterId && { chapterId }),
        ...(publish !== undefined && { publish }),
      };

      const response = await axios.get(
        `${baseUrl}/admin/quizzes/${getState().common.auth.sid}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
          params,
        }
      );

      if (response.data.success) {
        return response.data.quizzes; // Return filtered quizzes
      } else {
        throw new Error(response.data.message || "Failed to fetch quizzes");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quizzes"
      );
    }
  }
);

// Thunk for fetching quiz by ID
export const fetchQuizByIdThunk = createAsyncThunk(
  "quiz/fetchQuizById",
  async (quizId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState); // Get token from state
      const response = await axios.get(`${baseUrl}/admin/quiz/${quizId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      if (response.data.success) {
        return response.data.quiz; // Return fetched quiz
      } else {
        throw new Error(response.data.message || "Quiz not found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quiz"
      );
    }
  }
);
