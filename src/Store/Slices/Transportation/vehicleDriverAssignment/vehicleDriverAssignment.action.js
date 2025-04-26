import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData, postData } from "../../../../services/apiEndpoints";


// Create or Update Driver-Vehicle Assignment
export const createOrUpdateDriverVehicleAssignment = createAsyncThunk(
  "driverVehicleAssignment/createOrUpdate",
  async (assignmentData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData("/transport/driver-vehicle-assignment", assignmentData);
      return data;
    } catch (error) {
      console.error("Error in createOrUpdateDriverVehicleAssignment:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Get All Driver-Vehicle Assignments
export const getDriverVehicleAssignments = createAsyncThunk(
  "driverVehicleAssignment/getAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/driver-vehicle-assignments?page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      console.error("Error in getDriverVehicleAssignments:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
