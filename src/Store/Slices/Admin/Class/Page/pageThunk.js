import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  deleteData,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

export const fetchAllPages = createAsyncThunk(
  "pages/fetchAllPages",
  async ({ cid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await getData(
        `/${getRole}/api/pages/class/pages/${cid}?say=${say}&semesterId=${semesterId}`
      );

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchPageById = createAsyncThunk(
  "pages/fetchPageById",
  async ({ pid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await getData(`/${getRole}/api/pages/${pid}?say=${say}`);

      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createPage = createAsyncThunk(
  "pages/createPage",
  async ({ pageData, cid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester?.id; // Ensure safe access

      if (!semesterId) {
        throw new Error("Semester ID is missing");
      }

      // Merge semesterId into the payload with pageData
      const payload = { ...pageData, semesterId };

      const response = await postData(
        `/${getRole}/api/pages/class/${cid}?say=${say}`,
        payload
      );

      if (response && response.success) {
        toast.success("Page Created");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePage = createAsyncThunk(
  "pages/updatePage",
  async ({ pageId, pageData }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const semesterId = getState().common.user.classInfo.selectedSemester.id; // Fetch semesterId correctly

      const response = await putData(
        `/${getRole}/api/pages/${pageId}?say=${say}&semesterId=${semesterId}`,
        pageData
      );

      if (response && response.success) {
        toast.success("Page Updated Successfully");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deletePage = createAsyncThunk(
  "pages/deletePage",
  async ({ pid }, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const getRole = getUserRole(getState);
      const response = await deleteData(
        `/${getRole}/api/pages/${pid}?say=${say}`
      );

      if (response && response.success) {
        toast.success("Page Deleted Successfully");
        return pid;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
