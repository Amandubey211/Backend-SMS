import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchFilteredQuizzesThunk = createAsyncThunk(
  "quiz/fetchFilteredQuizzes",
  async (
    { sid, moduleId, chapterId, publish },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const params = {
        ...(moduleId && { moduleId }),
        ...(chapterId && { chapterId }),
        ...(publish !== undefined && { publish }),
      };

      const subjectId =
        sid || getState().common.user.subjectInfo.selectedSubjectId;

      const endpoint = `/admin/quizzes/${subjectId}?say=${say}`;
      const response = await getData(endpoint,  params );

      if (response.success) {
        return response.quizzes;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchQuizByIdThunk = createAsyncThunk(
  "quiz/fetchQuizById",
  async (quizId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/quiz/${quizId}?say=${say}`;
      
      const response = await getData(endpoint);

      if (response.success) {
        return response.quiz;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addQuestionThunk = createAsyncThunk(
  "quiz/addQuestion",
  async ({ quizId, question }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/add_question/quiz/${quizId}?say=${say}`;
      const response = await putData(endpoint, question);

      if (response.success) {
        // console.log("Toast Triggered"); // Log here to confirm it’s called once
        toast.success("Question added", {
          id: "unique-toast-id",
          position: "bottom-left",
        });

        dispatch(fetchQuizByIdThunk(response.quiz._id));
        return response.quiz;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateQuestionThunk = createAsyncThunk(
  "quiz/updateQuestion",
  async ({ quizId, questionId, question }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/quiz/${quizId}/question/${questionId}?say=${say}`;
      const response = await putData(endpoint, question);

      if (response.success) {
        toast.success("Question updated successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return response.quiz;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteQuestionThunk = createAsyncThunk(
  "quiz/deleteQuestion",
  async ({ quizId, questionId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/quiz/${quizId}/question/${questionId}?say=${say}`;
      const response = await deleteData(endpoint);

      if (response.success) {
        toast.success("Question deleted successfully");
        dispatch(fetchQuizByIdThunk(quizId));
        return questionId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createQuizThunk = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/create_quiz?say=${say}`;
      const response = await postData(endpoint, quizData);

      if (response.success) {
        toast.success("Quiz created successfully");
        dispatch(fetchQuizByIdThunk(response.quiz._id));
        return response.quiz;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateQuizThunk = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ quizId, quizData, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/update_quiz/${quizId}?say=${say}`;
      const response = await putData(endpoint, quizData);

      if (response.success) {
        toast.success("Quiz updated successfully");
        dispatch(fetchQuizByIdThunk(quizId));

        // Navigate back to the previous page
        if (navigate) {
          navigate(-1);
        }

        return response.quiz;
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
      const say = getAY();
      dispatch(setShowError(false));

      const endpoint = `/admin/delete_quiz/${quizId}?say=${say}`;
      const response = await deleteData(endpoint);

      if (response.success) {
        toast.success("Quiz deleted successfully");
        dispatch(
          fetchFilteredQuizzesThunk({
            sid: getState().common.user.subjectInfo.selectedSubjectId,
          })
        );
        return quizId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
