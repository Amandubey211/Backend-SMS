// src/Store/Slices/${getRole}/Earnings/earningsThunks.js

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
import { getUserRole } from "../../../../Utils/getRoles";

/**
 * Helper function to determine the correct API endpoints based on category.
 */
const getEndpointForCategory = (getRole,category, action, id) => {
  const baseUrl = `/${getRole}/revenue`;
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
      // For penalties: create -> /${getRole}/penaltyAdjustment/add
      // update -> /${getRole}/penaltyAdjustment/cancel/:id
      if (action === "create") return `/${getRole}/penaltyAdjustment/add`;
      if (action === "update") return `/${getRole}/penaltyAdjustment/cancel/${id}`;
      break;

    default:
      throw new Error(`Category ${category} not supported.`);
  }
};

export const addEarnings = createAsyncThunk(
  "earnings/addEarnings",
  async ({ values, category }, { dispatch, rejectWithValue,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const endpoint = getEndpointForCategory(getRole,category, "create");
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
  async ({ values, category, id }, { dispatch, rejectWithValue,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const endpoint = getEndpointForCategory(getRole,category, "update", id);
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
  async (params, { rejectWithValue, dispatch,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/revenue/get-income?academicYear=${say}`,
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
export const fetchIncomesGraph = createAsyncThunk(
  "earnings/fetchIncomesGraph",
  async (params, { rejectWithValue, dispatch,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/dashboard/expenseAndEarningGraph?say=${say}`,
        params
      );
      let data = response.data?.sort((a, b) =>new Date(a?.time) - new Date(b?.time))
      return data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchEarningGraph = createAsyncThunk(
  "earnings/fetchEarningGraph",
  async ({ groupBy = "month" }, { rejectWithValue, dispatch,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/${getRole}/dashboard/revenue/graph`, {
        groupBy,
        say,
      });

      if (response?.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchCardDataRevenue = createAsyncThunk(
  "earnings/fetchCardDataRevenue",
  async ({ year }, { rejectWithValue, dispatch,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/${getRole}/revenue/get-card-data-revenue`, {
        academicYearId: say,
        year,
      });

      if (response?.success) {
        // Transform the response data into an array of card objects
        return response.data;
        // const transformedData = transformCardData(response.data);
        // return transformedData;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteEarnings = createAsyncThunk(
  "earnings/deleteEarnings",
  async ({ category, id }, { dispatch, rejectWithValue,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const baseUrl = `/${getRole}/revenue`;
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
          endpoint = `/${getRole}/penaltyAdjustment/cancel/${id}`;
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
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
