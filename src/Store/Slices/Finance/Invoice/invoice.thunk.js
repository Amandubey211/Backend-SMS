import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData, postData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";

export const addInvoice = createAsyncThunk(
    "earnings/addInvoice",
    async (data, { dispatch, rejectWithValue }) => {
      const say = getAY();
      dispatch(setShowError(false));
      try {
        const response = await postData(`/finance/invoice/create?say=${say}`, data);
          toast.success("Invoice create successfully!");
        return response.data
      } catch (error) {
        return handleError(error, dispatch, rejectWithValue);
      }
    }
  );
export const fetchInvoice = createAsyncThunk(
    "earnings/fetchInvoice",
    async (params, { dispatch, rejectWithValue }) => {
      const say = getAY();
    dispatch(setShowError(false));
      try {
        const response = await getData(`/finance/invoice/get?say=${say}`,params);
        return response.data
      } catch (error) {
        return handleError(error, dispatch, rejectWithValue);
      }
    }
  );