import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";

// Fetch all announcements
export const fetchAnnouncementsThunk = createAsyncThunk(
  "announcements/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    const { common } = getState(); // Get token from the Redux state
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/all/notices`, {
        headers: { Authentication: `Bearer ${token}` }, // Use the token in the headers
      });
      return response.data.notices;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notices"
      );
    }
  }
);

// Create new announcement
export const createAnnouncementThunk = createAsyncThunk(
  "announcements/create",
  async (announcementData, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState(); // Get token from the Redux state
    const token = common.auth.token;

    try {
      const response = await axios.post(
        `${baseUrl}/admin/create_notice`,
        announcementData,
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: `Bearer ${token}`,
          }, // Use the token in the headers
        }
      );
      dispatch(fetchAnnouncementsThunk());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create notice"
      );
    }
  }
);

// Update announcement
export const updateAnnouncementThunk = createAsyncThunk(
  "announcements/update",
  async (
    { noticeId, updatedData },
    { rejectWithValue, getState, dispatch }
  ) => {
    const { common } = getState(); // Get token from the Redux state
    const token = common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/update/notice/${noticeId}`,
        updatedData,
        {
          headers: { Authentication: `Bearer ${token}` }, // Use the token in the headers
        }
      );
      dispatch(fetchAnnouncementsThunk());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update notice"
      );
    }
  }
);

// Delete announcement
export const deleteAnnouncementThunk = createAsyncThunk(
  "announcements/delete",
  async (noticeId, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState(); // Get token from the Redux state
    const token = common.auth.token;

    try {
      await axios.delete(`${baseUrl}/admin/delete/notice/${noticeId}`, {
        headers: { Authentication: `Bearer ${token}` }, // Use the token in the headers
      });
      dispatch(fetchAnnouncementsThunk());
      return noticeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notice"
      );
    }
  }
);
