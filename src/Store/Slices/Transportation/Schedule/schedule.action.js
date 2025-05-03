import { createAsyncThunk } from '@reduxjs/toolkit';
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from '../../../../services/apiEndpoints';

// Action to fetch the schedules
export const getSchedules = createAsyncThunk('schedule/getSchedules',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/get-shifts/vehicles`);
      return data;
    } catch (error) {
      console.error("Error in getAllShifts:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
