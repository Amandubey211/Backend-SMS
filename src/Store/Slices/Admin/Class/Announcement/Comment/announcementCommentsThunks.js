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

export const fetchAnnouncementComments = createAsyncThunk(
  "announcementComments/fetchComments",
  async (announcementId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/getAnnouncementComment/${announcementId}?say=${say}`
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const addAnnouncementComment = createAsyncThunk(
  "announcementComments/addComment",
  async ({ announcementId, text }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const payload = { content: text, parentId: null };
      const response = await postData(
        `/admin/createCommentAnnouncement/${announcementId}/replies?say=${say}`,
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

export const addAnnouncementReply = createAsyncThunk(
  "announcementComments/addReply",
  async ({ announcementId, parentId, text }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const payload = { content: text, parentId };
      const response = await postData(
        `/admin/createCommentAnnouncement/${announcementId}/replies?say=${say}`,
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

export const deleteAnnouncementComment = createAsyncThunk(
  "announcementComments/deleteComment",
  async (commentId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(
        `/admin/deleteCommentAnnouncement/${commentId}?say=${say}`
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

export const toggleLikeAnnouncementComment = createAsyncThunk(
  "announcementComments/toggleLike",
  async (commentId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await putData(
        `/admin/likeAnnouncementComment/${commentId}?say=${say}`
      );

      if (response && response.status) {
        return commentId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
