import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import {
  setShowError,
  setErrorMsg,
} from "../../../../../Common/Alerts/alertsSlice";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setActiveTab, setAttemptHistory, setQuizResults } from "./quizesSlice";
import { toast } from "react-hot-toast";
const say = localStorage.getItem("say");

// Helper Function: Get Token
const getToken = (dispatch) => {
  const token = localStorage.getItem("student:token");
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication failed!"));
    throw new Error("Authentication failed!");
  }
  return token;
};

// Thunks

export const stdGetQuiz = createAsyncThunk(
  "quiz/stdGetQuiz",
  async ({ cid, sid, moduleId, chapterId }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken(dispatch);

      const res = await axios.get(
        `${baseUrl}/student/studentquiz/class/${cid}?say=${say}`,
        {
          headers: { Authentication: token },
          params: { subjectId: sid, moduleId, chapterId },
        }
      );

      const data = res?.data?.quizzes?.reverse();
      return data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const stdGetSingleQuiz = createAsyncThunk(
  "quiz/stdGetSingleQuiz",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken(dispatch);

      const res = await axios.get(
        `${baseUrl}/student/quiz/${quizId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      return res?.data?.quiz;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "studentQuiz/submitQuiz",
  async (
    { quizId, answers, timeTaken, attemptHistory, isReattempt = false },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const token = getToken(dispatch);

      const body = { studentAnswers: answers, timeTaken, isReattempt };

      const res = await axios.post(
        `${baseUrl}/student/studentquiz/submit/${quizId}?say=${say}`,
        body,
        {
          headers: {
            Authentication: token,
          },
        }
      );

      const data = res?.data;
      dispatch(
        setQuizResults({
          totalPoints: data.score,
          correctAnswers: data.rightAnswer,
          wrongAnswers: data.wrongAnswer,
        })
      );

      const newAttempt = {
        attempts: attemptHistory.length + 1,
        score: data.score,
        rightAnswer: data.rightAnswer,
        wrongAnswer: data.wrongAnswer,
        questions: answers,
      };

      // dispatch(setAttemptHistory((prev) => [...prev, newAttempt]));
      dispatch(fetchAllAttemptHistory({ quizId }));
      toast.success("Quiz Submitted Successfully ");
      return newAttempt;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAttemptHistory = createAsyncThunk(
  "quiz/fetchAttemptHistory",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken(dispatch);

      const res = await axios.get(
        `${baseUrl}/student/studentquiz/${quizId}/attempt?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      return res?.data?.submission;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllAttemptHistory = createAsyncThunk(
  "quiz/fetchAllAttemptHistory",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken(dispatch);

      const res = await axios.get(
        `${baseUrl}/student/studentquiz/${quizId}/attempt?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      return res?.data?.submission || [];
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const startQuiz = createAsyncThunk(
  "quiz/startQuiz",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken(dispatch);

      const res = await axios.post(
        `${baseUrl}/student/studentquiz/startQuiz/${quizId}?say=${say}`,
        {},
        {
          headers: { Authentication: token },
        }
      );

      return res?.data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const updateRemainingTime = createAsyncThunk(
  "quiz/updateRemainingTime",
  async ({ quizId, remainingTime }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken(dispatch);

      const body = { quizId, remainingTime };

      const res = await axios.put(
        `${baseUrl}/student/studentquiz/updateQuizTime/${quizId}?say=${say}`,
        body,
        {
          headers: { Authentication: token },
        }
      );

      return res?.data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err.message));
      return rejectWithValue(err.message);
    }
  }
);
