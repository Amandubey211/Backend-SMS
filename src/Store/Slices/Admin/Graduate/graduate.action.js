import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from '../../../../config/Common';
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";

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

// Fetch Graduates
export const fetchGraduates = createAsyncThunk(
  "graduates/fetchGraduates",
  async (
    { batchStart, batchEnd, email, Q_Id, admissionNumber, page, limit },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(`${baseUrl}/admin/graduates/students?say=${say}`, {
        headers: { Authentication: token },
        params: { batchStart, batchEnd, email, Q_Id, admissionNumber, page, limit },
      });

      return {
        data: response.data.data,
        total: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Demote Students
export const demoteStudents = createAsyncThunk(
  "students/demoteStudents",
  async ({ studentIds }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      
      const response = await axios.put(
        `${baseUrl}/admin/demote/students?say=${say}`,
        { studentIds },
        {
          headers: { Authentication: token },
        }
      );

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
