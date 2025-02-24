import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { setQuizResults } from "./quizesSlice";
import { toast } from "react-hot-toast";
import { getAY } from "../../../../../../../Utils/academivYear";
import {
  getData,
  postData,
  putData,
} from "../../../../../../../services/apiEndpoints";

export const stdGetQuiz = createAsyncThunk(
  "quiz/stdGetQuiz",
  async (
    { cid, sid, moduleId, chapterId },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(
        `/student/studentquiz/class/${cid}?say=${say}&semesterId=${semesterId}`,
        { subjectId: sid, moduleId, chapterId }
      );

      const data = res?.quizzes?.reverse();
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const stdGetSingleQuiz = createAsyncThunk(
  "quiz/stdGetSingleQuiz",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const res = await getData(`/student/quiz/${quizId}?say=${say}`);

      return res?.quiz;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
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
      const say = getAY();
      dispatch(setShowError(false));

      const body = { studentAnswers: answers, timeTaken, isReattempt };

      const data = await postData(
        `/student/studentquiz/submit/${quizId}?say=${say}`,
        body
      );

      dispatch(
        setQuizResults({
          totalPoints: data.score,
          correctAnswers: data.rightAnswer,
          wrongAnswers: data.wrongAnswer,
        })
      );

      const newAttempt = {
        attempts: attemptHistory?.length + 1,
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
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// export const fetchAttemptHistory = createAsyncThunk(
//   "quiz/fetchAttemptHistory",
//   async ({ quizId }, { rejectWithValue, dispatch }) => {
//     try {
//       const say = getAY();
//       dispatch(setShowError(false));

//       const res = await getData(
//         `/student/studentquiz/${quizId}/attempt?say=${say}`
//       );

//       return res?.submission;
//     } catch (error) {
//       handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

export const fetchAllAttemptHistory = createAsyncThunk(
  "quiz/fetchAllAttemptHistory",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const res = await getData(
        `/student/studentquiz/${quizId}/attempt?say=${say}`
      );

      return res?.submission || [];
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const startQuiz = createAsyncThunk(
  "quiz/startQuiz",
  async ({ quizId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const data = await postData(
        `/student/studentquiz/startQuiz/${quizId}?say=${say}`,
        {}
      );

      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateRemainingTime = createAsyncThunk(
  "quiz/updateRemainingTime",
  async ({ quizId, remainingTime }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const body = { quizId, remainingTime };

      const data = await putData(
        `/student/studentquiz/updateQuizTime/${quizId}?say=${say}`,
        body
      );

      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
