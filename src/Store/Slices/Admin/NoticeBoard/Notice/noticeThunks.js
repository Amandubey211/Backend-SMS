import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { deleteData, getData, postData, putData } from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";




// Fetch all notices
export const fetchNoticesThunk = createAsyncThunk(
  "notice/fetchAll",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(`/${getRole}/all/notices?say=${say}`);
      return response?.notices;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create new notice
export const createNoticeThunk = createAsyncThunk(
  "notice/create",
  async (noticeData, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await postData(
        `/${getRole}/create_notice?say=${say}`,
        noticeData);
      dispatch(fetchNoticesThunk());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update notice
export const updateNoticeThunk = createAsyncThunk(
  "notice/update",
  async ({ noticeId, updatedData }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/update/notice/${noticeId}?say=${say}`,
        updatedData);
      dispatch(fetchNoticesThunk());
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete notice
export const deleteNoticeThunk = createAsyncThunk(
  "notice/delete",
  async (noticeId, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      await deleteData(`/${getRole}/delete/notice/${noticeId}?say=${say}`);
      dispatch(fetchNoticesThunk());
      return noticeId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
