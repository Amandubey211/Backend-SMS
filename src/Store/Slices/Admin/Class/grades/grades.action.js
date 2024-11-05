import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
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

// Thunk for fetching subject grades
export const fetchSubjectGrades = createAsyncThunk(
  "subject/grades",
  async ({ classId, subjectId, filters }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/grades/class/${classId}/subject/${subjectId}?say=${say}`,
        {
          headers: { Authentication: token },
          params: filters,
        }
      );
      return response.data?.gradesResult;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
