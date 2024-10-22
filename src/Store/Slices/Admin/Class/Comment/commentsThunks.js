import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const getApiEndpoint = (moduleType, action, id) => {
  const routes = {
    announcement: {
      fetch: `${baseUrl}/admin/getAnnouncementComment/${id}`,
      addComment: `${baseUrl}/admin/createCommentAnnouncement/${id}/replies`,
      addReply: `${baseUrl}/admin/createCommentAnnouncement/${id}/replies`,
      deleteComment: `${baseUrl}/admin/deleteCommentAnnouncement/${id}`,
      toggleLike: `${baseUrl}/admin/likeAnnouncementComment/${id}`,
    },
    discussion: {
      fetch: `${baseUrl}/admin/getDiscussionComment/${id}`,
      addComment: `${baseUrl}/admin/createCommentDiscussion/${id}/replies`,
      addReply: `${baseUrl}/admin/createCommentDiscussion/${id}/replies`,
      deleteComment: `${baseUrl}/admin/deleteCommentDiscussion/${id}`,
      toggleLike: `${baseUrl}/admin/likeDiscussionComment/${id}`,
    },
  };

  return routes[moduleType][action];
};

// Fetch comments by module type (announcement or discussion)
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ moduleType, id }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token; // Retrieve token from Redux state
    try {
      const endpoint = getApiEndpoint(moduleType, "fetch", id);
      const response = await axios.get(endpoint, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if (response.data.status) {
        return response.data.data; // Returning fetched comments
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching comments");
      return rejectWithValue(error.message || "Error fetching comments");
    }
  }
);

// Add a new comment to a module (announcement or discussion)
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ moduleType, id, text }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token; // Retrieve token from Redux state
    try {
      const endpoint = getApiEndpoint(moduleType, "addComment", id);
      const response = await axios.post(
        endpoint,
        { content: text, parentId: null },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        toast.success("Comment added successfully");
        return response.data.data; // Returning added comment data
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      toast.error(error.message || "Error adding comment");
      return rejectWithValue(error.message || "Error adding comment");
    }
  }
);

// Add a reply to a comment in a module (announcement or discussion)
export const addReply = createAsyncThunk(
  "comments/addReply",
  async ({ moduleType, id, parentId, text }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token; // Retrieve token from Redux state
    try {
      const endpoint = getApiEndpoint(moduleType, "addReply", id);
      const response = await axios.post(
        endpoint,
        { content: text, parentId },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        toast.success("Reply added successfully");
        return { parentId, reply: response.data.data }; // Returning added reply data
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      toast.error(error.message || "Error adding reply");
      return rejectWithValue(error.message || "Error adding reply");
    }
  }
);

// Delete a comment from a module (announcement or discussion)
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ moduleType, commentId }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token; // Retrieve token from Redux state
    try {
      const endpoint = getApiEndpoint(moduleType, "deleteComment", commentId);
      const response = await axios.delete(endpoint, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if (response.data.status) {
        toast.success("Comment deleted successfully");
        return commentId; // Return deleted commentId
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting comment");
      return rejectWithValue(error.message || "Error deleting comment");
    }
  }
);

// Toggle like for a comment in a module (announcement or discussion)
export const toggleLikeComment = createAsyncThunk(
  "comments/toggleLike",
  async ({ moduleType, commentId }, { rejectWithValue, getState }) => {
    const token = getState().common.auth.token; // Retrieve token from Redux state
    try {
      const endpoint = getApiEndpoint(moduleType, "toggleLike", commentId);
      const response = await axios.put(
        endpoint,
        {},
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        return commentId; // Return liked commentId
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      toast.error(error.message || "Error toggling like");
      return rejectWithValue(error.message || "Error toggling like");
    }
  }
);
