import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";

const say = localStorage.getItem("say");

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
