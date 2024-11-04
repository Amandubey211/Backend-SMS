import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
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

// Dynamic API endpoint generator
const getApiEndpoint = (moduleType, action, id) => {
  const routes = {
    announcement: {
      fetch: `${baseUrl}/admin/getAnnouncementComment/${id}?say=${say}`,
      addComment: `${baseUrl}/admin/createCommentAnnouncement/${id}/replies?say=${say}`,
      addReply: `${baseUrl}/admin/createCommentAnnouncement/${id}/replies?say=${say}`,
      deleteComment: `${baseUrl}/admin/deleteCommentAnnouncement/${id}?say=${say}`,
      toggleLike: `${baseUrl}/admin/likeAnnouncementComment/${id}?say=${say}`,
    },
    discussion: {
      fetch: `${baseUrl}/admin/getDiscussionComment/${id}?say=${say}`,
      addComment: `${baseUrl}/admin/createCommentDiscussion/${id}/replies?say=${say}`,
      addReply: `${baseUrl}/admin/createCommentDiscussion/${id}/replies?say=${say}`,
      deleteComment: `${baseUrl}/admin/deleteCommentDiscussion/${id}?say=${say}`,
      toggleLike: `${baseUrl}/admin/likeDiscussionComment/${id}?say=${say}`,
    },
  };
  return routes[moduleType][action];
};

// Thunks
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ moduleType, id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const endpoint = getApiEndpoint(moduleType, "fetch", id);
      const response = await axios.get(endpoint, {
        headers: { Authentication: token },
      });
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ moduleType, id, text }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const endpoint = getApiEndpoint(moduleType, "addComment", id);
      const response = await axios.post(
        endpoint,
        { content: text, parentId: null },
        { headers: { Authentication: token } }
      );
      if (response.data.status) {
        toast.success("Comment added successfully");
        return response.data.data;
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addReply = createAsyncThunk(
  "comments/addReply",
  async ({ moduleType, id, parentId, text }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const endpoint = getApiEndpoint(moduleType, "addReply", id);
      const response = await axios.post(
        endpoint,
        { content: text, parentId },
        { headers: { Authentication: token } }
      );
      if (response.data.status) {
        toast.success("Reply added successfully");
        return { parentId, reply: response.data.data };
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ moduleType, commentId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const endpoint = getApiEndpoint(moduleType, "deleteComment", commentId);
      const response = await axios.delete(endpoint, {
        headers: { Authentication: token },
      });
      if (response.data.status) {
        toast.success("Comment deleted successfully");
        return commentId;
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  "comments/toggleLike",
  async ({ moduleType, commentId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const endpoint = getApiEndpoint(moduleType, "toggleLike", commentId);
      const response = await axios.put(endpoint, {}, {
        headers: { Authentication: token },
      });
      if (response.data.status) {
        return commentId;
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
