import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData, postData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";


// Create or Update Driver-Vehicle Assignment
export const createOrUpdateDriverVehicleAssignment = createAsyncThunk(
  "driverVehicleAssignment/createOrUpdate",
  async (assignmentData, { rejectWithValue, dispatch }) => {
    try {
        // const say= getAY();
      dispatch(setShowError(false));
      const data = await postData(`/transport/driver-vehicle-assignment`, assignmentData);
      dispatch(getDriverVehicleAssignments())
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
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/driver-vehicle-assignments`);
      return data;
    } catch (error) {
      console.error("Error in getDriverVehicleAssignments:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
