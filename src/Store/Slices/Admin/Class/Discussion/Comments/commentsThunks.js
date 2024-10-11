import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../config/Common";

// Fetch comments by discussion
export const fetchComments = createAsyncThunk(
  "discussionComments/fetchComments",
  async (discussionId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Retrieve token from Redux state
      const response = await axios.get(
        `${baseUrl}/admin/getDiscussionComment/${discussionId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        return response.data.data; // Returning comments data
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching comments");
      return rejectWithValue(error.message || "Error fetching comments");
    }
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  "discussionComments/addComment",
  async ({ discussionId, text }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Retrieve token from Redux state
      const response = await axios.post(
        `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies`,
        { content: text, parentId: null },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        toast.success("Comment added successfully");
        return response.data.data; // Return the added comment data
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      toast.error(error.message || "Error adding comment");
      return rejectWithValue(error.message || "Error adding comment");
    }
  }
);

// Add a reply to a comment
export const addReply = createAsyncThunk(
  "discussionComments/addReply",
  async ({ discussionId, parentId, text }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Retrieve token from Redux state
      const response = await axios.post(
        `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies`,
        { content: text, parentId },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        toast.success("Reply added successfully");
        return { parentId, reply: response.data.data }; // Return parentId and added reply
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      toast.error(error.message || "Error adding reply");
      return rejectWithValue(error.message || "Error adding reply");
    }
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "discussionComments/deleteComment",
  async (commentId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Retrieve token from Redux state
      const response = await axios.delete(
        `${baseUrl}/admin/deleteCommentDiscussion/${commentId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
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

// Delete a reply
export const deleteReply = createAsyncThunk(
  "discussionComments/deleteReply",
  async (replyId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Retrieve token from Redux state
      const response = await axios.delete(
        `${baseUrl}/admin/deleteCommentDiscussion/${replyId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        toast.success("Reply deleted successfully");
        return replyId; // Return deleted replyId
      } else {
        throw new Error("Failed to delete reply");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting reply");
      return rejectWithValue(error.message || "Error deleting reply");
    }
  }
);

// Toggle like for a message
export const toggleLikeMessage = createAsyncThunk(
  "discussionComments/toggleLike",
  async (messageId, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token; // Retrieve token from Redux state
      const response = await axios.put(
        `${baseUrl}/admin/likeDiscussions/${messageId}`,
        {},
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        return messageId; // Return liked messageId
      } else {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      toast.error(error.message || "Error toggling like");
      return rejectWithValue(error.message || "Error toggling like");
    }
  }
);
