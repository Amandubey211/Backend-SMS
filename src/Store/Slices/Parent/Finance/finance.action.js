import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";



// Fetch finance data for parent
export const fetchParentFinanceData = createAsyncThunk(
  "dashboard/fetchAccountingData",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`${baseUrl}/parent/api/fees?say=${say}`);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchParentFeeBreakdown = createAsyncThunk(
  "dashboard/fetchParentFeeBreakdown",
  async ({ subCategory, feeCycle, startDate, endDate, studentId }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const queryParams = new URLSearchParams({ say });
      if (subCategory) queryParams.append("subCategory", subCategory);
      if (feeCycle) queryParams.append("feeCycle", feeCycle);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (studentId) queryParams.append("studentId", studentId);

      const data = await getData(`${baseUrl}/parent/api/breakdown/fees?${queryParams}`);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
