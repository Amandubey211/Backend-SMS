import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
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

// Fetch all notices
export const fetchNoticesThunk = createAsyncThunk(
  "notice/fetchAll",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/all/notices?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.notices;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create new notice
export const createNoticeThunk = createAsyncThunk(
  "notice/create",
  async (noticeData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(
        `${baseUrl}/admin/create_notice?say=${say}`,
        noticeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: token,
          },
        }
      );
      dispatch(fetchNoticesThunk());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update notice
export const updateNoticeThunk = createAsyncThunk(
  "notice/update",
  async ({ noticeId, updatedData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/update/notice/${noticeId}?say=${say}`,
        updatedData,
        {
          headers: { Authentication: token },
        }
      );
      dispatch(fetchNoticesThunk());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete notice
export const deleteNoticeThunk = createAsyncThunk(
  "notice/delete",
  async (noticeId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      await axios.delete(`${baseUrl}/admin/delete/notice/${noticeId}?say=${say}`, {
        headers: { Authentication: token },
      });
      dispatch(fetchNoticesThunk());
      return noticeId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
