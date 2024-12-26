import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { postData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";

export const addInvoice = createAsyncThunk(
    "earnings/addEarnings",
    async (data, { dispatch, rejectWithValue }) => {
      try {
        const response = await postData('/finance/invoice/create', data);
        return response
      } catch (error) {
        return handleError(error, dispatch, rejectWithValue);
      }
    }
  );