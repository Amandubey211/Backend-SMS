import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";

// fetch student fees details
export const StudentFinanceDetails = createAsyncThunk(
  `fees/StudentFinanceDetails`,
  async ({ studentId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/student/fees/${studentId}?say=${say}`);
      console.log("student finance data", data);

      return data;
    } catch (error) {
      console.error("Error in StudentFinanceDetails:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
