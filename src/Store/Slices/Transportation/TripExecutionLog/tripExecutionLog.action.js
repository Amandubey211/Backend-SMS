import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import toast from "react-hot-toast";

export const createTripLog = createAsyncThunk(
  "tripExecutionLog/create",
  async (bodyData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData(`/transport/create-trip-log`, bodyData);
      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error(error.message);
      console.error("Error in createTripLog:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const startTripLog = createAsyncThunk(
  "tripExecutionLog/start",
  async (
    { tripId, isGPSOn, payload, vehicleId },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setShowError(false));
      const query = `isGPSOn=${isGPSOn}`;
      const data = await postData(
        `/transport/start-trip/${tripId}?${query}`,
        payload
      );
      dispatch(getTripLogsByVehicle({ vehicleId }));
      return data;
    } catch (error) {
      console.error("Error in startTripLog:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const endTripLog = createAsyncThunk(
  "tripExecutionLog/end",

  async ({tripId,vehicleId,currentLocation}, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData(`/transport/trip/${tripId}/end`,{currentLocation});
      dispatch(getTripLogsByVehicle({vehicleId}));

      return data;
    } catch (error) {
      console.error("Error in endTripLog:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const cancelTripLog = createAsyncThunk(
  "tripExecutionLog/cancel",
  async ({ tripId, vehicleId }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));

      // This is the dummy implementation - in a real app, you would call an API endpoint
      // For now, we'll simulate a successful response after a short delay
      const dummyResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Trip cancelled successfully",
            data: {
              _id: tripId,
              status: "cancelled",
              updatedAt: new Date().toISOString(),
            },
          });
        }, 1000);
      });

      // Refresh the trip logs after cancellation
      dispatch(getTripLogsByVehicle({ vehicleId }));

      // Show success message
      toast.success(dummyResponse.message);

      return dummyResponse;
    } catch (error) {
      console.error("Error in cancelTripLog:", error);
      toast.error(error.message || "Failed to cancel trip");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const getTripLogsByVehicle = createAsyncThunk(
  "tripExecutionLog/getByVehicle",
  async (
    { vehicleId, page = 1, limit = 10, type = "today" },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = await getData(
        `/transport/trip-logs/vehicle/${vehicleId}?page=${page}&limit=${limit}&type=${type}`
      );
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

export const toggleGPS = createAsyncThunk(
  "liveTracking/gps",

  async ({tripId,enable,currentLocation}, { rejectWithValue, dispatch }) => {
    try {
      const data = await putData(`/transport/trip/toggle-gps/location/${tripId}`,{enable,currentLocation});

      dispatch(getAllTripLogs());
      return data;
    } catch (error) {
      console.error("Error in toggleGPS:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
