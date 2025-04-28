/* Path: features/transportation/SubRoute/subRoute.action.js */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";

/* 🔹 helpers -------------------------------------------------------- */
const silent = (dispatch) => dispatch(setShowError(false));

/* 🔹 LIST ----------------------------------------------------------- */
export const getSubRoutesBySchool = createAsyncThunk(
  "subRoute/getAllBySchool",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      return await getData("/transport/subRoute/school");
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 CREATE --------------------------------------------------------- */
export const createSubRoute = createAsyncThunk(
  "subRoute/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      const res = await postData("/transport/subRoute", payload);
      /* refresh list */
      dispatch(getSubRoutesBySchool());
      return res;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 UPDATE --------------------------------------------------------- */
export const updateSubRoute = createAsyncThunk(
  "subRoute/update",
  async ({ subRouteId, updateData }, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      const res = await putData(
        `/transport/subRoute/${subRouteId}`,
        updateData
      );
      /* refresh list */
      dispatch(getSubRoutesBySchool());
      return res;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 DELETE --------------------------------------------------------- */
export const deleteSubRoute = createAsyncThunk(
  "subRoute/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      await deleteData(`/transport/subRoute/${id}`);
      /* refresh list */
      dispatch(getSubRoutesBySchool());
      return { id };
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 SINGLE --------------------------------------------------------- */
export const getSubRouteById = createAsyncThunk(
  "subRoute/getById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      return await getData(`/transport/subRoute/${id}`);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);
