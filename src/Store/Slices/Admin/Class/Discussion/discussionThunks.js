import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";

// Fetch all discussions for a class
export const fetchClassDiscussions = createAsyncThunk(
  "discussions/fetchClassDiscussions",
  async ({ cid }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/getDiscussion/class/${cid}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching discussions"
      );
    }
  }
);

// Fetch a single discussion by ID
export const fetchDiscussionById = createAsyncThunk(
  "discussions/fetchDiscussionById",
  async ({ did }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/getDiscussionById/${did}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching discussion"
      );
    }
  }
);

// Create a new discussion
export const createDiscussion = createAsyncThunk(
  "discussions/createDiscussion",
  async ({ discussionData, cid }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const formData = new FormData();
      Object.keys(discussionData).forEach((key) => {
        formData.append(key, discussionData[key]);
      });
      const response = await axios.post(
        `${baseUrl}/admin/createDiscussion/class/${cid}`,
        formData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating discussion"
      );
    }
  }
);

// Update an existing discussion
export const updateDiscussion = createAsyncThunk(
  "discussions/updateDiscussion",
  async ({ discussionId, discussionData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const formData = new FormData();
      Object.keys(discussionData).forEach((key) => {
        formData.append(key, discussionData[key]);
      });
      const response = await axios.put(
        `${baseUrl}/admin/updateDiscussion/${discussionId}`,
        formData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating discussion"
      );
    }
  }
);

// Delete a discussion
export const deleteDiscussion = createAsyncThunk(
  "discussions/deleteDiscussion",
  async ({ discussionId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.delete(
        `${baseUrl}/admin/deleteDiscussion/${discussionId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return discussionId; // Return the deleted discussion's ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting discussion"
      );
    }
  }
);

// Mark a discussion as read
export const markAsReadDiscussion = createAsyncThunk(
  "discussions/markAsReadDiscussion",
  async ({ discussionId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/discussion/readstatus/${discussionId}`,
        {},
        { headers: { Authentication: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error marking discussion as read"
      );
    }
  }
);

// Update the pin status of a discussion
export const updatePinStatus = createAsyncThunk(
  "discussions/updatePinStatus",
  async ({ discussionId, isPinned }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/discussion/pinstatus/${discussionId}`,
        { isPinned },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating pin status"
      );
    }
  }
);
