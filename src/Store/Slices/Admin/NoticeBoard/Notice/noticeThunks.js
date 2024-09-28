import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common"; // Ensure this base URL is set properly

// Fetch all notices
export const fetchNoticesThunk = createAsyncThunk(
  "notice/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/all/notices`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.notices;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notices"
      );
    }
  }
);

// Create new notice
export const createNoticeThunk = createAsyncThunk(
  "notice/create",
  async (noticeData, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.post(
        `${baseUrl}/admin/create_notice`,
        noticeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchNoticesThunk());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create notice"
      );
    }
  }
);

// Update notice
export const updateNoticeThunk = createAsyncThunk(
  "notice/update",
  async (
    { noticeId, updatedData },
    { rejectWithValue, getState, dispatch }
  ) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/update/notice/${noticeId}`,
        updatedData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      dispatch(fetchNoticesThunk());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update notice"
      );
    }
  }
);

// Delete notice
export const deleteNoticeThunk = createAsyncThunk(
  "notice/delete",
  async (noticeId, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      await axios.delete(`${baseUrl}/admin/delete/notice/${noticeId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      dispatch(fetchNoticesThunk());
      return noticeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notice"
      );
    }
  }
);
