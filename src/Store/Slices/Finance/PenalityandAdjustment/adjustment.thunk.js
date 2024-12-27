import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";



export const fetchReturnInvoice = createAsyncThunk(
    "earnings/fetchInvoice",
    async (params, { dispatch, rejectWithValue }) => {
      const say = getAY();
    dispatch(setShowError(false));
      try {
        const response = await getData(`/finance/penaltyAdjustment/getAll?say=${say}`,params);
        console.log(response.data);
        return response.data

      } catch (error) {
        return handleError(error, dispatch, rejectWithValue);
      }
    }
  );