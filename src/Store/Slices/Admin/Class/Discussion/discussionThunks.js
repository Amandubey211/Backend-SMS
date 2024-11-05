import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
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

// Thunks
export const fetchClassDiscussions = createAsyncThunk(
  "discussions/fetchClassDiscussions",
  async ({ cid }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/getDiscussion/class/${cid}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchDiscussionById = createAsyncThunk(
  "discussions/fetchDiscussionById",
  async ({ did }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/getDiscussionById/${did}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createDiscussion = createAsyncThunk(
  "discussions/createDiscussion",
  async ({ discussionData, cid }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const formData = new FormData();
      Object.keys(discussionData).forEach((key) => {
        formData.append(key, discussionData[key]);
      });
      const response = await axios.post(
        `${baseUrl}/admin/createDiscussion/class/${cid}?say=${say}`,
        formData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateDiscussion = createAsyncThunk(
  "discussions/updateDiscussion",
  async ({ discussionId, discussionData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const formData = new FormData();
      Object.keys(discussionData).forEach((key) => {
        formData.append(key, discussionData[key]);
      });
      const response = await axios.put(
        `${baseUrl}/admin/updateDiscussion/${discussionId}?say=${say}`,
        formData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteDiscussion = createAsyncThunk(
  "discussions/deleteDiscussion",
  async ({ discussionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.delete(
        `${baseUrl}/admin/deleteDiscussion/${discussionId}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return discussionId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const markAsReadDiscussion = createAsyncThunk(
  "discussions/markAsReadDiscussion",
  async ({ discussionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.put(
        `${baseUrl}/admin/discussion/readstatus/${discussionId}?say=${say}`,
        {},
        { headers: { Authentication: token } }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePinStatus = createAsyncThunk(
  "discussions/updatePinStatus",
  async ({ discussionId, isPinned }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.put(
        `${baseUrl}/admin/discussion/pinstatus/${discussionId}?say=${say}`,
        { isPinned },
        { headers: { Authentication: token } }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
