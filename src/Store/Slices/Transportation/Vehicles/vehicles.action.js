import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { deleteData, getData, postData, putData } from "../../../../services/apiEndpoints";

// Get All Vehicles

export const getAllVehicles = createAsyncThunk(
  "transportVehicle/getAllVehicles",  // 🔥 Slice के नाम के हिसाब से सही कर दिया
  async ({ page = 1, limit = 10 }, { rejectWithValue, dispatch }) => { 
    try {
      dispatch(setShowError(false));

      const response = await getData(`/transport/get-vehicles?page=${page}&limit=${limit}`);
      return response; 
    } catch (error) {
      console.error("Error in getAllVehicles:", error);
      return rejectWithValue(handleError(error, dispatch, rejectWithValue));
    }
  }
);


// Get Vehicle By Id
export const getVehicleById = createAsyncThunk(
  "transportRoute/getVehicleById",
  async (vehicleId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/get-vehicle/${vehicleId}`);
      return data;
    } catch (error) {
      console.error("Error in getVehicleById:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Vehicle
export const createVehicle = createAsyncThunk(
  "transportRoute/createVehicle",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData(`/transport/create-vehicle`, payload);
      return data;
    } catch (error) {
      console.error("Error in createVehicle:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Vehicle
export const updateVehicle = createAsyncThunk(
  "transportRoute/updateVehicle",
  async ({ vehicleId, payload }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await putData(`/transport/update-vehicle/${vehicleId}`, payload);
      return data;
    } catch (error) {
      console.error("Error in updateVehicle:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Vehicle
export const deleteVehicle = createAsyncThunk(
  "transportRoute/deleteVehicle",
  async (vehicleId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await deleteData(`/transport/delete-vehicle/${vehicleId}`);
      return data;
    } catch (error) {
      console.error("Error in deleteVehicle:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
