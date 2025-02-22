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
import { getUserRole } from "../../../../../../Utils/getRoles";

export const fetchComments = createAsyncThunk(
  "discussionComments/fetchComments",
  async (discussionId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/getDiscussionComment/${discussionId}?say=${say}`
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
  async ({ discussionId, text }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const payload = { content: text, parentId: null };
      const response = await postData(
        `/${getRole}/createCommentDiscussion/${discussionId}/replies?say=${say}`,
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
  async (
    { discussionId, parentId, text },
    { rejectWithValue, dispatch, getState }
  ) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const payload = { content: text, parentId };
      const response = await postData(
        `/${getRole}/createCommentDiscussion/${discussionId}/replies?say=${say}`,
        payload
      );

      if (response && response.status) {
        return { parentId, reply: response.data };
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "discussionComments/deleteComment",
  async (commentId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/deleteCommentDiscussion/${commentId}?say=${say}`
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
  async (replyId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/deleteCommentDiscussion/${replyId}?say=${say}`
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
  async (messageId, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/likeDiscussions/${messageId}?say=${say}`,
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
