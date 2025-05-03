/* Path: features/Transportation/RoutesManagment/routes.action.js */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";

/* helper to silence global alert */
const silent = (dispatch) => dispatch(setShowError(false));

/* 🔹 LIST ------------------------------------------------------- */
export const getRoutesBySchool = createAsyncThunk(
  "routes/getAllBySchool",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      return await getData("/transport/route/school");
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 SINGLE ----------------------------------------------------- */
export const getRouteById = createAsyncThunk(
  "routes/getById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      return await getData(`/transport/route/${id}`);
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 CREATE ----------------------------------------------------- */
export const createRoute = createAsyncThunk(
  "routes/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      const res = await postData("/transport/route", payload);
      dispatch(getRoutesBySchool()); // refresh list
      return res;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 UPDATE ----------------------------------------------------- */
export const updateRoute = createAsyncThunk(
  "routes/update",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      const res = await putData(`/transport/route/${id}`, data);
      dispatch(getRoutesBySchool()); // refresh list
      return res;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 DELETE ----------------------------------------------------- */
export const deleteRoute = createAsyncThunk(
  "routes/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      await deleteData(`/transport/route/${id}`);
      dispatch(getRoutesBySchool()); // refresh list
      return { id };
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 GET TRANSPORT USERS ---------------------------------------- */
export const getTransportUsers = createAsyncThunk(
  "routes/getTransportUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      return await getData("/transport/route/student/staff/list");
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* 🔹 ASSIGN VEHICLES TO ROUTE ----------------------------------- */
export const assignVehiclesToRoute = createAsyncThunk(
  "routes/assignVehicles",
  async ({ routeId, vehicleIds }, { dispatch, rejectWithValue }) => {
    try {
      silent(dispatch);
      const res = await putData(`/transport/route/assignVehicle/${routeId}`, {
        vehicleIds,
      });
      dispatch(getRoutesBySchool()); // refresh list
      return res;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);




