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
      const token = getToken(getState);
      const params = {
        ...(moduleId && { moduleId }),
        ...(chapterId && { chapterId }),
        ...(publish !== undefined && { publish }),
      };

      const response = await axios.get(
        `${baseUrl}/admin/quizzes/${
          getState().common.user.subjectInfo.selectedSubjectId
        }`,
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
      //toast.error(error.response?.data?.message || error.message);
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
      const token = getToken(getState);
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

// Add a Question Thunk
export const addQuestionThunk = createAsyncThunk(
  "quiz/addQuestion",
  async ({ quizId, question }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState);
      const response = await axios.put(
        `${baseUrl}/admin/add_question/quiz/${quizId}`,
        question,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Question added successfully");
        dispatch(fetchQuizByIdThunk(response.data.quiz._id));
        // dispatch(fetchQuizByIdThunk(quizId))
        return response.data.quiz; // Return the updated quiz data
      } else {
        throw new Error(response.data.message || "Failed to add question");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add question"
      );
    }
  }
);

// Update a Question Thunk
export const updateQuestionThunk = createAsyncThunk(
  "quiz/updateQuestion",
  async (
    { quizId, questionId, question },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.put(
        `${baseUrl}/admin/quiz/${quizId}/question/${questionId}`,
        question,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Question updated successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return response.data.quiz; // Return the updated quiz data
      } else {
        throw new Error(response.data.message || "Failed to update question");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update question"
      );
    }
  }
);

// Delete a Question Thunk
export const deleteQuestionThunk = createAsyncThunk(
  "quiz/deleteQuestion",
  async ({ quizId, questionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState);
      const response = await axios.delete(
        `${baseUrl}/admin/quiz/${quizId}/question/${questionId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Question deleted successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return questionId; // Return the deleted question ID
      } else {
        throw new Error(response.data.message || "Failed to delete question");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete question"
      );
    }
  }
);

// Thunk to create a quiz
export const createQuizThunk = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(
        `${baseUrl}/admin/create_quiz`,
        quizData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Quiz created successfully");
        dispatch(fetchQuizByIdThunk(response.data.quiz._id));
        return response.data.quiz;
      } else {
        throw new Error(response.data.message || "Failed to create quiz");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create quiz"
      );
    }
  }
);

// Thunk to update a quiz
export const updateQuizThunk = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ quizId, quizData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState);
      const response = await axios.put(
        `${baseUrl}/admin/update_quiz/${quizId}`,
        quizData,
        {
          headers: { Authentication: `Bearer ${token}` },
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
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quiz"
      );
    }
  }
);

// Thunk to delete a quiz
export const deleteQuizThunk = createAsyncThunk(
  "quiz/deleteQuiz",
  async (quizId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState);

      const response = await axios.delete(
        `${baseUrl}/admin/delete_quiz/${quizId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Quiz deleted successfully");
        dispatch(fetchFilteredQuizzesThunk({}));

        return quizId; // Return the deleted quiz ID
      } else {
        throw new Error(response.data.message || "Failed to delete quiz");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete quiz"
      );
    }
  }
);
