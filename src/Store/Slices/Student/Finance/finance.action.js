import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";

// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/student/my_fees?say=${say}`);
      return data;
    } catch (error) {
      console.error("Error in StudentFinanceDetails:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
