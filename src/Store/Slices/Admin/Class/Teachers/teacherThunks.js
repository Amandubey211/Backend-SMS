import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setTeacherAssign, setTeachers, filterTeachersBySection } from "./teacherSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";

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

// Fetch all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teachers/fetchAllTeachers",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(`${baseUrl}/admin/teacher?say=${say}`, {
        headers: { Authentication: token },
      });
      dispatch(setTeachers(response.data.data));
      dispatch(filterTeachersBySection());
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch teachers by class
export const fetchTeachersByClass = createAsyncThunk(
  "teachers/fetchByClass",
  async (classId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const { data } = await axios.get(`${baseUrl}/admin/teacherByClass?say=${say}`, {
        params: { id: classId },
        headers: { Authentication: token },
      });
      dispatch(setTeacherAssign(data.data));
      dispatch(filterTeachersBySection());
      return data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign teacher to a class
export const assignTeacher = createAsyncThunk(
  "teacher/assignTeacher",
  async (assignData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.post(
        `${baseUrl}/admin/teacher?say=${say}`,
        assignData,
        {
          headers: { Authentication: token },
        }
      );
      dispatch(fetchTeachersByClass(assignData.classId));
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Unassign teacher from a class
export const unassignTeacher = createAsyncThunk(
  "teacher/unassignTeacher",
  async ({ teacherId, classId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      await axios.delete(
        `${baseUrl}/admin/teacher/${teacherId}/class/${classId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );
      dispatch(fetchTeachersByClass(classId));
      return teacherId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
