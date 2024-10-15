import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../config/Common";

// Fetch comments for an announcement
export const fetchAnnouncementComments = createAsyncThunk(
  "announcementComments/fetchComments",
  async (announcementId, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token;
    try {
      const response = await axios.get(
        `${baseUrl}/admin/getAnnouncementComment/${announcementId}`,
        { headers: { Authentication: `Bearer ${token}` } }
      );
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching comments");
      return rejectWithValue(error.message || "Error fetching comments");
    }
  }
);

// Add a new comment to an announcement
export const addAnnouncementComment = createAsyncThunk(
  "announcementComments/addComment",
  async ({ announcementId, text }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token;
    try {
      const response = await axios.post(
        `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
        { content: text, parentId: null },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      if (response.data.status) {
        toast.success("Comment added successfully");
        return response.data.data;
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      toast.error(error.message || "Error adding comment");
      return rejectWithValue(error.message || "Error adding comment");
    }
  }
);

// Add a reply to a comment in an announcement
export const addAnnouncementReply = createAsyncThunk(
  "announcementComments/addReply",
  async ({ announcementId, parentId, text }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token;
    try {
      const response = await axios.post(
        `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
        { content: text, parentId },
        { headers: { Authentication: `Bearer ${token}` } }
      );
      if (response.data.status) {
        toast.success("Reply added successfully");
        return { parentId, reply: response.data.data };
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      toast.error(error.message || "Error adding reply");
      return rejectWithValue(error.message || "Error adding reply");
    }
  }
);

// Delete a comment from an announcement
export const deleteAnnouncementComment = createAsyncThunk(
  "announcementComments/deleteComment",
  async (commentId, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token;
    try {
      const response = await axios.delete(
        `${baseUrl}/admin/deleteCommentAnnouncement/${commentId}`,
        { headers: { Authentication: `Bearer ${token}` } }
      );
      if (response.data.status) {
        toast.success("Comment deleted successfully");
        return commentId;
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting comment");
      return rejectWithValue(error.message || "Error deleting comment");
    }
  }
);

// Toggle like for a comment in an announcement
export const toggleLikeAnnouncementComment = createAsyncThunk(
  "announcementComments/toggleLike",
  async (commentId, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token;
    try {
      const response = await axios.put(
        `${baseUrl}/admin/likeAnnouncementComment/${commentId}`,
        {},
        { headers: { Authentication: `Bearer ${token}` } }
      );
      if (response.data.status) {
        return commentId;
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      toast.error(error.message || "Error toggling like");
      return rejectWithValue(error.message || "Error toggling like");
    }
  }
);
