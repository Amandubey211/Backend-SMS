import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData } from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";

export const createTripLog = createAsyncThunk(
    "tripExecutionLog/create",
    async (bodyData, { rejectWithValue, dispatch }) => {
      try {
        dispatch(setShowError(false));
        const data = await postData(`/transport/create-trip-log`, bodyData);
        toast.success(data.message)
        return data;
      } catch (error) {
        toast.error(error.message)
        console.error("Error in createTripLog:", error);
        return handleError(error, dispatch, rejectWithValue);
      }
    }
);

export const startTripLog = createAsyncThunk(
  "tripExecutionLog/start",
  async ({ tripId, isGPSOn, payload,vehicleId }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const query = `isGPSOn=${isGPSOn}`;
      const data = await postData(
        `/transport/start-trip/${tripId}?${query}`,
        payload
      );
      dispatch(getTripLogsByVehicle({vehicleId}))
      return data;
    } catch (error) {
      console.error("Error in startTripLog:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const endTripLog = createAsyncThunk(
  "tripExecutionLog/end",
  async ({tripId,vehicleId}, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData(`/transport/trip/${tripId}/end`);
      dispatch(getTripLogsByVehicle({vehicleId}));
      return data;
    } catch (error) {
      console.error("Error in endTripLog:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const getTripLogsByVehicle = createAsyncThunk(
  "tripExecutionLog/getByVehicle",
  async ({ vehicleId, page = 1, limit = 10, type = "today" }, { rejectWithValue, dispatch }) => {
    try {
      const data = await getData(`/transport/trip-logs/vehicle/${vehicleId}?page=${page}&limit=${limit}&type=${type}`);
      return data;
    } catch (error) {
      console.error("Error in getTripLogsByVehicle:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const getAllTripLogs = createAsyncThunk(
  "tripExecutionLog/getAll",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await getData(`/transport/trip-logs`);
      return data;
    } catch (error) {
      console.error("Error in getAllTripLogs:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
