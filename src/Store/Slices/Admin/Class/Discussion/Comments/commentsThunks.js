import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";

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
export const fetchComments = createAsyncThunk(
  "discussionComments/fetchComments",
  async (discussionId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/getDiscussionComment/${discussionId}?say=${say}`,
        { headers: { Authentication: token } }
      );
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
  "discussionComments/addComment",
  async ({ discussionId, text }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.post(
        `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`,
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
  "discussionComments/addReply",
  async ({ discussionId, parentId, text }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.post(
        `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`,
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
  "discussionComments/deleteComment",
  async (commentId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.delete(
        `${baseUrl}/admin/deleteCommentDiscussion/${commentId}?say=${say}`,
        { headers: { Authentication: token } }
      );
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

export const deleteReply = createAsyncThunk(
  "discussionComments/deleteReply",
  async (replyId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.delete(
        `${baseUrl}/admin/deleteCommentDiscussion/${replyId}?say=${say}`,
        { headers: { Authentication: token } }
      );
      if (response.data.status) {
        toast.success("Reply deleted successfully");
        return replyId;
      } else {
        throw new Error("Failed to delete reply");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const toggleLikeMessage = createAsyncThunk(
  "discussionComments/toggleLike",
  async (messageId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.put(
        `${baseUrl}/admin/likeDiscussions/${messageId}?say=${say}`,
        {},
        { headers: { Authentication: token } }
      );
      if (response.data.status) {
        return messageId;
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
