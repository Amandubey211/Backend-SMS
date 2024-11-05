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

// Fetch All Pages Thunk
export const fetchAllPages = createAsyncThunk(
  "pages/fetchAllPages",
  async ({ cid }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/api/pages/class/pages/${cid}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch pages");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Page by ID Thunk
export const fetchPageById = createAsyncThunk(
  "pages/fetchPageById",
  async ({ pid }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/api/pages/${pid}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch page");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Page Thunk
export const createPage = createAsyncThunk(
  "pages/createPage",
  async ({ pageData, cid }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.post(
        `${baseUrl}/admin/api/pages/class/${cid}?say=${say}`,
        pageData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to create page");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Page Thunk
export const updatePage = createAsyncThunk(
  "pages/updatePage",
  async ({ pageId, pageData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.put(
        `${baseUrl}/admin/api/pages/${pageId}?say=${say}`,
        pageData,
        {
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to update page");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Page Thunk
export const deletePage = createAsyncThunk(
  "pages/deletePage",
  async ({ pid }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.delete(
        `${baseUrl}/admin/api/pages/${pid}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.success) {
        return pid;
      } else {
        throw new Error("Failed to delete page");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
