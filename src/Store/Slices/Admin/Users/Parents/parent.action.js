import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from the Redux state
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

// Fetch all parents
export const fetchAllParent = createAsyncThunk(
  "user/allParent",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch); // Get token with error handling
      const response = await axios.get(`${baseUrl}/admin/all/Parents?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Use centralized error handling
    }
  }
);
