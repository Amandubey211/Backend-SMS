import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state with centralized error handling
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

// Thunks with integrated error handling, token management, and `say` parameter

export const fetchFilteredQuizzesThunk = createAsyncThunk(
  "quiz/fetchFilteredQuizzes",
  async (
    { moduleId, chapterId, publish },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const params = {
        ...(moduleId && { moduleId }),
        ...(chapterId && { chapterId }),
        ...(publish !== undefined && { publish }),
      };

      const response = await axios.get(
        `${baseUrl}/admin/quizzes/${
          getState().common.user.subjectInfo.selectedSubjectId
        }?say=${say}`,
        {
          headers: { Authentication: token },
          params,
        }
      );

      if (response.data.success) {
        return response.data.quizzes;
      } else {
        throw new Error(response.data.message || "Failed to fetch quizzes");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchQuizByIdThunk = createAsyncThunk(
  "quiz/fetchQuizById",
  async (quizId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.get(
        `${baseUrl}/admin/quiz/${quizId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.success) {
        return response.data.quiz;
      } else {
        throw new Error(response.data.message || "Quiz not found");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addQuestionThunk = createAsyncThunk(
  "quiz/addQuestion",
  async ({ quizId, question }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.put(
        `${baseUrl}/admin/add_question/quiz/${quizId}?say=${say}`,
        question,
        { headers: { Authentication: token } }
      );

      if (response.data.success) {
        toast.success("Question added successfully");
        dispatch(fetchQuizByIdThunk(response.data.quiz._id));
        return response.data.quiz;
      } else {
        throw new Error(response.data.message || "Failed to add question");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateQuestionThunk = createAsyncThunk(
  "quiz/updateQuestion",
  async (
    { quizId, questionId, question },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.put(
        `${baseUrl}/admin/quiz/${quizId}/question/${questionId}?say=${say}`,
        question,
        { headers: { Authentication: token } }
      );

      if (response.data.success) {
        toast.success("Question updated successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return response.data.quiz;
      } else {
        throw new Error(response.data.message || "Failed to update question");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteQuestionThunk = createAsyncThunk(
  "quiz/deleteQuestion",
  async ({ quizId, questionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.delete(
        `${baseUrl}/admin/quiz/${quizId}/question/${questionId}?say=${say}`,
        { headers: { Authentication: token } }
      );

      if (response.data.success) {
        toast.success("Question deleted successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return questionId;
      } else {
        throw new Error(response.data.message || "Failed to delete question");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createQuizThunk = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.post(
        `${baseUrl}/admin/create_quiz?say=${say}`,
        quizData,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.success) {
        toast.success("Quiz created successfully");
        dispatch(fetchQuizByIdThunk(response.data.quiz._id));
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create quiz");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateQuizThunk = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ quizId, quizData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.put(
        `${baseUrl}/admin/update_quiz/${quizId}?say=${say}`,
        quizData,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.success) {
        toast.success("Quiz updated successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return response.data.quiz;
      } else {
        throw new Error(response.data.message || "Failed to update quiz");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteQuizThunk = createAsyncThunk(
  "quiz/deleteQuiz",
  async (quizId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const response = await axios.delete(
        `${baseUrl}/admin/delete_quiz/${quizId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.success) {
        toast.success("Quiz deleted successfully");
        dispatch(fetchFilteredQuizzesThunk({}));
        return quizId;
      } else {
        throw new Error(response.data.message || "Failed to delete quiz");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
