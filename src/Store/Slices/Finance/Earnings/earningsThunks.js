// src/Store/Slices/Finance/Earnings/earningsThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";

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
        toast.success("Earnings added successfully!");
        return response.data;
      } else {
        dispatch(setShowError(true));
        toast.error(response?.message || "Failed to add earnings.");
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
        toast.success("Earnings updated successfully!");
        return response.data;
      } else {
        dispatch(setShowError(true));
        toast.error(response?.message || "Failed to update earnings.");
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
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/finance/revenue/get-income?academicYear=${say}`,
        params
      );

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
export const fetchEarningGraph = createAsyncThunk(
  "earnings/fetchEarningGraph",
  async ({ groupBy = "month" }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData("/finance/dashboard/revenue/graph", {
        groupBy,
        say,
      });

      if (response?.success) {
        return response.data;
      } else {
        toast.error(response?.message || "Failed to fetch expense graph data.");
        return rejectWithValue(
          response?.message || "Failed to fetch expense graph data."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchCardDataRevenue = createAsyncThunk(
  "earnings/fetchCardDataRevenue",
  async ({ year }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/finance/revenue/get-card-data-revenue`, {
        academicYearId: say,
        year,
      });

      if (response?.success) {
        // Transform the response data into an array of card objects
        return response.data;
        // const transformedData = transformCardData(response.data);
        // return transformedData;
      } else {
        return rejectWithValue(
          response?.message || "Failed to fetch card data revenue."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteEarnings = createAsyncThunk(
  "earnings/deleteEarnings",
  async ({ category, id }, { dispatch, rejectWithValue }) => {
    try {
      const baseUrl = "/finance/revenue";
      let endpoint;

      // Determine the endpoint for deletion
      switch (category) {
        case "Facility-Based Revenue":
          endpoint = `${baseUrl}/facility/delete-income/${id}`;
          break;
        case "Financial Investments":
          endpoint = `${baseUrl}/delete/financialInvestment/${id}`;
          break;
        case "Community and External Revenue":
          endpoint = `${baseUrl}/delete/communityExternalAffairs/${id}`;
          break;
        case "Service-Based Revenue":
          endpoint = `${baseUrl}/delete/serviceBased/${id}`;
          break;
        case "Penalties":
          endpoint = `/finance/penaltyAdjustment/cancel/${id}`;
          break;
        default:
          throw new Error(`Category ${category} not supported for deletion.`);
      }

      const response = await deleteData(endpoint);

      if (response?.success) {
        const params = {
          page: 1,
          limit: 20,
          includeDetails: true,
        };
        dispatch(fetchAllIncomes(params));
        return id;
      } else {
        toast.error(response?.message || "Failed to delete earnings.");
        return rejectWithValue(
          response?.message || "Failed to delete earnings."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
