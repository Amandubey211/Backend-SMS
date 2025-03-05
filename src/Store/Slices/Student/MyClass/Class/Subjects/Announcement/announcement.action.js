import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../../../Utils/academivYear";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../../../services/apiEndpoints";

export const fetchStudentAnnounce = createAsyncThunk(
  "announce/fetchStudentAnnounce",
  async ({ cid, sid }, { rejectWithValue, dispatch, getState }) => {
    try {
      const semesterId = getState().common.user.classInfo.selectedSemester.id;
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/announcement/class/${cid}/subject/${sid}?say=${say}&semesterId=${semesterId}`
      );
      const data = response?.data;
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchStudentAnnounceById = createAsyncThunk(
  "announce/fetchStudentAnnounceById",
  async ({aid, cid, sid}, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/announcement/${aid}?say=${say}`);
      const data = response?.data;
      // console.log("response data---", data);
      dispatch(fetchStudentAnnounce({ cid, sid }));
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const markAsReadStudentAnnounce = createAsyncThunk(
  "announce/markAsReadStudentAnnounce",
  async ({ id, cid, sid }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/markAsRead/announcement/${id}?say=${say}`
      );
      console.log("mark data---", response);
      const data = response;
      console.log("fetch again");

      dispatch(fetchStudentAnnounce({ cid, sid }));
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// comments api's
export const fetchStudentAnnounceComments = createAsyncThunk(
  "announce/fetchStudentAnnounceComments",
  async ({ aid }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/getAnnouncementComment/${aid}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createStudentAnnounceComment = createAsyncThunk(
  "announce/createStudentAnnounceComment",
  async ({ aid, text }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await postData(
        `/admin/createCommentAnnouncement/${aid}/replies?say=${say}`,
        { content: text, parentId: null }
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createStudentAnnounceReply = createAsyncThunk(
  "announce/createStudentAnnounceReply",
  async ({ aid, replyId, text }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await postData(
        `/admin/createCommentAnnouncement/${aid}/replies?say=${say}`,
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

export const deleteStudentAnnounceComment = createAsyncThunk(
  "announce/deleteStudentAnnounceComment",
  async ({ commentId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await deleteData(
        `/admin/deleteCommentannouncement/${commentId}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteStudentAnnounceReply = createAsyncThunk(
  "announce/deleteStudentAnnounceComment",
  async ({ replyId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await deleteData(
        `/admin/deleteCommentannouncement/${replyId}?say=${say}`
      );
      const data = response?.data;
      // console.log("response data---", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editStudentAnnounceComment = createAsyncThunk(
  "announce/editStudentAnnounceComment",
  async ({ commentId, newText }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/editCommentAnnouncement/${commentId}?say=${say}`,
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

export const editStudentAnnounceReply = createAsyncThunk(
  "announce/editStudentAnnounceReply",
  async ({ replyId, newText }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/editCommentAnnouncement/${replyId}?say=${say}`,
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

export const toggleStudentAnnounceLike = createAsyncThunk(
  "announce/toggleStudentAnnounceLike",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/likeAnnouncementComment/${id}?say=${say}`,
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
