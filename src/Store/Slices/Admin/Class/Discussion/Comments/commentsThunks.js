import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { setShowError } from "../../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../../Common/Alerts/errorhandling.action";
import {
  postData,
  deleteData,
  getData,
  putData,
} from "../../../../../../services/apiEndpoints";
import { getAY } from "../../../../../../Utils/academivYear";

export const fetchComments = createAsyncThunk(
  "discussionComments/fetchComments",
  async (discussionId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(
        `/admin/getDiscussionComment/${discussionId}`,
        {
          params: { say },
        }
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addComment = createAsyncThunk(
  "discussionComments/addComment",
  async ({ discussionId, text }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const payload = { content: text, parentId: null };
      const response = await postData(
        `/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`,
        payload
      );

      if (response && response.status) {
        toast.success("Comment added successfully");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addReply = createAsyncThunk(
  "discussionComments/addReply",
  async ({ discussionId, parentId, text }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const payload = { content: text, parentId };
      const response = await postData(
        `/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`,
        payload
      );

      if (response && response.status) {
        toast.success("Reply added successfully");
        return { parentId, reply: response.data };
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "discussionComments/deleteComment",
  async (commentId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(
        `/admin/deleteCommentDiscussion/${commentId}?say=${say}`
      );

      if (response && response.status) {
        toast.success("Comment deleted successfully");
        return commentId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteReply = createAsyncThunk(
  "discussionComments/deleteReply",
  async (replyId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(
        `/admin/deleteCommentDiscussion/${replyId}?say=${say}`
      );

      if (response && response.status) {
        toast.success("Reply deleted successfully");
        return replyId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const toggleLikeMessage = createAsyncThunk(
  "discussionComments/toggleLike",
  async (messageId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await putData(
        `/admin/likeDiscussions/${messageId}?say=${say}`,
        {}
      );

      if (response && response.status) {
        return messageId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
