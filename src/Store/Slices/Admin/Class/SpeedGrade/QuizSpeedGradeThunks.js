import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, putData } from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchAssignedQuizStudents = createAsyncThunk(
  "speedGrade/fetchAssignedQuizStudents",
  async (quizId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/speed_grade/quiz/${quizId}`;
      const params = { say };
      const response = await getData(endpoint, { params });

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the list of assigned students
      } else {
        throw new Error(
          response.message || "Failed to fetch assigned quiz students"
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentQuiz = createAsyncThunk(
  "speedGrade/fetchStudentQuiz",
  async ({ studentId, quizId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/speed_grade/quiz`;
      const params = { say, studentId, quizId };
      const response = await getData(endpoint, params);

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the student's quiz details
      } else {
        throw new Error(response.message || "Failed to fetch student quiz");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const assignQuizGrade = createAsyncThunk(
  "speedGrade/assignQuizGrade",
  async (
    { studentId, quizId, attemptDate, score, status },
    { rejectWithValue, dispatch }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/speed_grade/quiz/grade`;
      const params = { say };
      const requestBody = { studentId, quizId, attemptDate, score, status };
      const response = await putData(endpoint, requestBody, { params });

      if (response && response.success) {
        toast.success("Grade Assigned");
        dispatch(fetchStudentQuiz({ studentId, quizId }));
        return response.data; // Assuming 'data' contains the updated quiz data
      } else {
        throw new Error(response.message || "Failed to assign quiz grade");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
