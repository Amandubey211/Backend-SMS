// src/store/finance/thunks/earningsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData } from "../../../../services/apiEndpoints";

/**
 * Fetch all incomes with query parameters.
 * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
 */
export const fetchAllIncomes = createAsyncThunk(
  "earnings/fetchAllIncomes",
  async (params, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false)); // Assuming you have an action to control error visibility
      const response = await getData("/finance/revenue/get-income", params);

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
