import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData, putData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";

export const fetchReturnInvoice = createAsyncThunk(
  "fetchreturnInvoice",
  async (params, { dispatch, rejectWithValue }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/finance/penaltyAdjustment/getAll?say=${say}`,
        params
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchReturnCardData = createAsyncThunk(
  "card/fetchReturnInvoice",
  async (params, { dispatch, rejectWithValue }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/finance/dashboard/penaltyAdjustment/cardData?say=${say}`,
        params
      );
      return response?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const cancleReturnInvoiceData = createAsyncThunk(
  "card/cancelReturnInvoice",
  async ({ params,id }, { dispatch, rejectWithValue }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await putData(
        `/finance/penaltyAdjustment/cancel/${id}?say=${say}`
      );
      dispatch(fetchReturnInvoice(params));
      dispatch(fetchReturnCardData());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
