import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { deleteData, getData, postData, putData } from "../../../../services/apiEndpoints";

// Create SubRoute
export const createSubRoute = createAsyncThunk(
  "subRoute/create",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData("/transport/subRoute", payload);
      return data;
    } catch (error) {
      console.error("Error in createSubRoute:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Get All SubRoutes By School
export const getSubRoutesBySchool = createAsyncThunk(
  "subRoute/getAllBySchool",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData("/transport/subRoute/school");
      return data;
    } catch (error) {
      console.error("Error in getSubRoutesBySchool:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Get SubRoute By ID
export const getSubRouteById = createAsyncThunk(
  "subRoute/getById",
  async (subRouteId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/subRoute/${subRouteId}`);
      return data;
    } catch (error) {
      console.error("Error in getSubRouteById:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update SubRoute
export const updateSubRoute = createAsyncThunk(
  "subRoute/update",
  async ({ subRouteId, updateData }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await putData(`/transport/subRoute/${subRouteId}`, updateData);
      return data;
    } catch (error) {
      console.error("Error in updateSubRoute:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete SubRoute
export const deleteSubRoute = createAsyncThunk(
  "subRoute/delete",
  async (subRouteId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      await deleteData(`/transport/subRoute/${subRouteId}`);
      return { id: subRouteId };
    } catch (error) {
      console.error("Error in deleteSubRoute:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
