import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { stdFinance } from "../../../../Utils/EndpoinUrls/stdEndpointUrl";

// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(stdFinance);
      return data;
    } catch (error) {
      console.error("Error in StudentFinanceDetails:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
