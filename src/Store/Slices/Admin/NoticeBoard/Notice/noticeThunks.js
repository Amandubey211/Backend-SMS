import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";
import toast from "react-hot-toast";

// Fetch all notices with pagination support
export const fetchNoticesThunk = createAsyncThunk(
  "notice/fetchAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/all/notices?say=${say}&page=${page}&limit=${limit}`
      );
      console.log(response, "fetched notices");
      return response;
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
        noticeData
      );
      const currentpage = getState().admin.notice.currentPage;
      dispatch(fetchNoticesThunk({ page: currentpage, limit: 10 }));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update notice
export const updateNoticeThunk = createAsyncThunk(
  "notice/update",
  async (
    { noticeId, updatedData },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/update/notice/${noticeId}?say=${say}`,
        updatedData
      );
      const currentpage = getState().admin.notice.currentPage;
      dispatch(fetchNoticesThunk({ page: currentpage, limit: 10 }));
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
      toast.success("Notice Delete successfully");
      const currentpage = getState().admin.notice.currentPage;
      dispatch(fetchNoticesThunk({ page: currentpage, limit: 10 }));
      return noticeId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// New Thunk: Fetch all notice users
export const fetchNoticeUsersThunk = createAsyncThunk(
  "notice/fetchNoticeUsers",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      // Call the new backend route
      const response = await getData(`/${getRole}/all/notices/users`);
      // Assuming the response has shape { error: false, data: [...] }
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
