import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, putData } from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchAssignedQuizStudents = createAsyncThunk(
  "speedGrade/fetchAssignedQuizStudents",
  async (quizId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/speed_grade/quiz/${quizId}?say=${say}`;

      const response = await getData(endpoint);

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the list of assigned students
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentQuiz = createAsyncThunk(
  "speedGrade/fetchStudentQuiz",
  async ({ studentId, quizId }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/speed_grade/quiz?say=${say}&studentId=${studentId}&quizId=${quizId}`;

      const response = await getData(endpoint);

      if (response && response.success) {
        return response.data; // Assuming 'data' contains the student's quiz details
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
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const endpoint = `/${getRole}/speed_grade/quiz/grade?say=${say}`;

      const requestBody = { studentId, quizId, attemptDate, score, status };
      const response = await putData(endpoint, requestBody);

      if (response && response.success) {
        toast.success("Grade Assigned");
        dispatch(fetchStudentQuiz({ studentId, quizId }));
        return response.data; // Assuming 'data' contains the updated quiz data
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
