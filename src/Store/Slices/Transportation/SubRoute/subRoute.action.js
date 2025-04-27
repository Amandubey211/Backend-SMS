/* Path unchanged: features/transportation/SubRoute/subRoute.action.js */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";

/* create */
export const createSubRoute = createAsyncThunk(
  "subRoute/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await postData("/transport/subRoute", payload);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* list */
export const getSubRoutesBySchool = createAsyncThunk(
  "subRoute/getAllBySchool",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await getData("/transport/subRoute/school");
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* single */
export const getSubRouteById = createAsyncThunk(
  "subRoute/getById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await getData(`/transport/subRoute/${id}`);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* update */
export const updateSubRoute = createAsyncThunk(
  "subRoute/update",
  async ({ subRouteId, updateData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await putData(`/transport/subRoute/${subRouteId}`, updateData);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* delete */
export const deleteSubRoute = createAsyncThunk(
  "subRoute/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      await deleteData(`/transport/subRoute/${id}`);
      return { id };
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);
