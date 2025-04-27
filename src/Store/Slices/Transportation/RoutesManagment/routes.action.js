/* Path unchanged: features/Transportation/RoutesManagment/routes.action.js */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";

/* 🔹 GET ALL ROUTES (BY SCHOOL) */
export const getRoutesBySchool = createAsyncThunk(
  "routes/getAllBySchool",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await getData("/transport/route/school");
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 GET SINGLE ROUTE */
export const getRouteById = createAsyncThunk(
  "routes/getById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await getData(`/transport/route/${id}`);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 CREATE ROUTE */
export const createRoute = createAsyncThunk(
  "routes/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await postData("/transport/route", payload);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 UPDATE ROUTE */
export const updateRoute = createAsyncThunk(
  "routes/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      return await putData(`/transport/route/${id}`, data);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);
