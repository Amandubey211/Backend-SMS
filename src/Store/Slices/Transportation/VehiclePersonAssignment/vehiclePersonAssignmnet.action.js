import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear";
import toast from "react-hot-toast";

// Fetch assigned status of persons
export const fetchPersonsAssignedStatus = createAsyncThunk(
  "transportation/fetchPersonsAssignedStatus",
  async ({ routeId, personType }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/transport/fetch-assigned-users?routeId=${routeId}&personType=${personType}&academicYear=${say}`
      );
      return response?.data;
    } catch (error) {
      console.error("Error in fetchPersonAssignment", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign persons to vehicle
export const assignPersonToVehicle = createAsyncThunk(
  "transportation/assignPersonToVehicle",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/transport/assign-users?academicYear=${say}`,
        payload
      );
      toast.success(response?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.message);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
