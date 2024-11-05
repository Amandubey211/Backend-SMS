import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";

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

// Fetch students by class and section
export const fetchStudentsByClassAndSection = createAsyncThunk(
  "students/fetchByClassAndSection",
  async (classId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/student/${classId}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch all students
export const fetchAllStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/all/students?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Promote Students
export const promoteStudents = createAsyncThunk(
  "students/promoteStudents",
  async (
    { studentIds, promotionClassId, academicYearId },
    { getState, rejectWithValue, dispatch }
  ) => {
    const token = getState().common.auth.token;
    const classId = getState().common.user.classInfo.selectedClassId;

    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/promote/students?say=${say}`,
        { studentIds, promotionClassId, academicYearId },
        { headers: { Authentication: token } }
      );
      toast.success("Student Promoted");
      dispatch(fetchStudentsByClassAndSection(classId));
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Promote Students in Same Class
export const promoteInSameClassStudents = createAsyncThunk(
  "students/promoteInSameClass",

  async (
    { studentIds, academicYearId },
    { getState, rejectWithValue, dispatch }
  ) => {
    const token = getState().common.auth.token;
    const classId = getState().common.user.classInfo.selectedClassId;


    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/promote/inSameClass/students?say=${say}`,
        { studentIds, academicYearId },
        { headers: { Authentication: token } }
      );
      dispatch(fetchStudentsByClassAndSection(classId));
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
  )

// Graduate Students
export const graduateStudents = createAsyncThunk(
  "students/graduateStudents",
  async ({ studentIds }, { getState, rejectWithValue, dispatch }) => {
    const classId = getState().common.user.classInfo.selectedClassId;
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/graduate/students?say=${say}`,
        { studentIds },
        { headers: { Authentication: token } }
      );
      // toast.success("Student Graduated");
      dispatch(fetchStudentsByClassAndSection(classId));
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Demote Students
export const demoteStudents = createAsyncThunk(
  "students/demoteStudents",
  async ({ studentIds }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/demote/students?say=${say}`,
        { studentIds },
        { headers: { Authentication: token } }
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Graduates
export const fetchGraduates = createAsyncThunk(
  "students/fetchGraduates",
  async (queryParams, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/graduates/students?say=${say}`, {
        headers: { Authentication: token },
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
