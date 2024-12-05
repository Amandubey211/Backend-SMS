import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  handleError,
} from "../../../../../Common/Alerts/errorhandling.action";
import {
  setShowError,
} from "../../../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../../../Utils/academivYear";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../../../services/apiEndpoints";

export const fetchStudentDiscussion = createAsyncThunk(
  "discussion/fetchStudentDiscussion",
  async ({cid,sid}, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/getDiscussion/class/${cid}/subject/${sid}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateStudentPinStatus = createAsyncThunk(
  "discussion/updateStudentPinStatus",
  async ({ discussionId, isPinned }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await putData(
        `/admin/discussion/pinstatus/${discussionId}?say=${say}`,
        { isPinned }
      );

      toast.success(
        `Discussion ${isPinned ? "pinned" : "unpinned"} successfully`
      );
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const markAsReadStudentDiscussion = createAsyncThunk(
  "discussion/markAsReadStudentDiscussion",
  async (discussionId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await putData(
        `/admin/discussion/readstatus/${discussionId}?say=${say}`,
        {}
      );
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentDiscussionById = createAsyncThunk(
  "discussion/fetchStudentDiscussionById",
  async (did, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/getDiscussionById/${did}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentCommentsByDiscussion = createAsyncThunk(
  "discussion/fetchStudentCommentsByDiscussion",
  async ({ discussionId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/getDiscussionComment/${discussionId}?say=${say}`
      );
      const data = response?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createStudentDiscussionComment = createAsyncThunk(
  "discussion/createStudentDiscussionComment",
  async ({ discussionId, comment }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await postData(
        `/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`,
        { content: comment, parentId: null }
      );
      const data = response?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createStudentDiscussionReply = createAsyncThunk(
  "discussion/createStudentDiscussionReply",
  async ({ discussionId, replyId, text }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await postData(
        `/admin/createCommentDiscussion/${discussionId}/replies?say=${say}`,
        { content: text, parentId: replyId }
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteStudentDiscussionComment = createAsyncThunk(
  "discussion/deleteStudentDiscussionComment",
  async ({ commentId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await deleteData(
        `/admin/deleteCommentDiscussion/${commentId}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteStudentDiscussionReply = createAsyncThunk(
  "discussion/deleteStudentDiscussionReply",
  async (replyId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await deleteData(
        `/admin/deleteCommentDiscussion/${replyId}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editStudentDiscussionComment = createAsyncThunk(
  "discussion/editStudentDiscussionComment",
  async ({ commentId, newText }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/editCommentDiscussion/${commentId}?say=${say}`,
        { content: newText }
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editStudentDiscussionReply = createAsyncThunk(
  "discussion/editStudentDiscussionReply",
  async ({ replyId, newText }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/editCommentDiscussion/${replyId}?say=${say}`,
        { content: newText }
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const toggleLikeStudentDiscussion = createAsyncThunk(
  "discussion/toggleLikeStudentDiscussion",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/likeDiscussions/${id}?say=${say}`,
        {}
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
