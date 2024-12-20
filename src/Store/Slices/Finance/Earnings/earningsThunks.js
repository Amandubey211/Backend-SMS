// src/Store/Slices/Finance/Earnings/earningsThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData, postData, putData } from "../../../../services/apiEndpoints";

/**
 * Helper function to determine the correct API endpoints based on category.
 */
const getEndpointForCategory = (category, action, id) => {
  const baseUrl = "/finance/revenue";
  const facilityBase = `${baseUrl}/facility`;

  switch (category) {
    case "Facility-Based Revenue":
      if (action === "create") return `${facilityBase}/income`;
      if (action === "update") return `${facilityBase}/update-income/${id}`;
      break;

    case "Financial Investments":
      if (action === "create") return `${baseUrl}/add/financialInvestment`;
      if (action === "update")
        return `${baseUrl}/edit/financialInvestment/${id}`;
      break;

    case "Community and External Revenue":
      if (action === "create") return `${baseUrl}/add/communityExternalAffairs`;
      if (action === "update")
        return `${baseUrl}/edit/communityExternalAffairs/${id}`;
      break;

    case "Service-Based Revenue":
      if (action === "create") return `${baseUrl}/add/serviceBased`;
      if (action === "update") return `${baseUrl}/edit/serviceBased/${id}`;
      break;

    case "Penalties":
      // For penalties: create -> /finance/penaltyAdjustment/add
      // update -> /finance/penaltyAdjustment/cancel/:id
      if (action === "create") return `/finance/penaltyAdjustment/add`;
      if (action === "update") return `/finance/penaltyAdjustment/cancel/${id}`;
      break;

    default:
      throw new Error(`Category ${category} not supported.`);
  }
};

export const addEarnings = createAsyncThunk(
  "earnings/addEarnings",
  async ({ values, category }, { dispatch, rejectWithValue }) => {
    try {
      const endpoint = getEndpointForCategory(category, "create");
      const response = await postData(endpoint, values);

      if (response?.success) {
        return response.data;
      } else {
        dispatch(setShowError(true));
        return rejectWithValue(response?.message || "Failed to add earnings.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateEarnings = createAsyncThunk(
  "earnings/updateEarnings",
  async ({ values, category, id }, { dispatch, rejectWithValue }) => {
    try {
      const endpoint = getEndpointForCategory(category, "update", id);
      const response = await putData(endpoint, values);

      if (response?.success) {
        return response.data;
      } else {
        dispatch(setShowError(true));
        return rejectWithValue(
          response?.message || "Failed to update earnings."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchAllIncomes = createAsyncThunk(
  "earnings/fetchAllIncomes",
  async (params, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData("/finance/revenue/get-income", params);

      if (response?.success) {
        return response;
      } else {
        return rejectWithValue(response?.message || "Failed to fetch incomes.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
