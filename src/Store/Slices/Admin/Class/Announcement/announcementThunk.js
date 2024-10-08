import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Fetch all announcements by class ID
export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async (cid, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/announcement/class/${cid}`,
        {
          headers: { Authentication: `Bearer ${token}` }, // Correct header for token
        }
      );
      return response.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch announcements";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Mark an announcement as read
export const markAsReadAnnouncement = createAsyncThunk(
  "announcement/markAsReadAnnouncement",
  async (_id, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      await axios.post(
        `${baseUrl}/admin/markAsRead/announcement/${_id}`,
        {},
        {
          headers: { Authentication: `Bearer ${token}` }, // Correct header for token
        }
      );
      toast.success("Announcement marked as read");
      return _id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to mark announcement as read";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch a single announcement by ID
export const fetchAnnouncementById = createAsyncThunk(
  "announcement/fetchAnnouncementById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(`${baseUrl}/admin/announcement/${id}`, {
        headers: { Authentication: `Bearer ${token}` }, // Correct header for token
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch announcement";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete an announcement by ID
export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      await axios.delete(`${baseUrl}/admin/announcement/${id}`, {
        headers: { Authentication: `Bearer ${token}` }, // Correct header for token
      });
      toast.success("Announcement deleted successfully");
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete announcement";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Create an announcement
export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async ({ data, files }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      if (files && files.attachment) {
        formData.append("attachment", files.attachment);
      }

      const response = await axios.post(
        `${baseUrl}/admin/announcement`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`, // Correct header for token
          },
        }
      );

      if (response.data.status) {
        toast.success("Announcement created successfully!");
        return response.data.data;
      } else {
        toast.error("Announcement not created");
        return rejectWithValue("Announcement not created");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create announcement";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Edit an announcement
export const editAnnouncement = createAsyncThunk(
  "announcement/editAnnouncement",
  async ({ id, data, files }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      if (files && files.attachment) {
        formData.append("attachment", files.attachment);
      }

      const response = await axios.put(
        `${baseUrl}/admin/announcement/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`, // Correct header for token
          },
        }
      );

      if (response.data.status) {
        toast.success("Announcement updated successfully!");
        return response.data.data;
      } else {
        toast.error("Announcement not updated");
        return rejectWithValue("Announcement not updated");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update announcement";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
