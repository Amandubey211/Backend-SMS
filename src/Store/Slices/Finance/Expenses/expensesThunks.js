// src/Store/Slices/Finance/Expenses/expensesThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";

/**
 * Helper function to determine the correct API endpoints based on expense category.
 */
const getEndpointForCategory = (category, action, id) => {
  const baseUrl = "/finance/expense";

  switch (category) {
    case "Salaries and Wages":
      if (action === "create") return `${baseUrl}/add/salaryWages`;
      if (action === "update") return `${baseUrl}/update/salaryWages/${id}`;
      break;

    case "Utility Maintenance":
      if (action === "create") return `${baseUrl}/add/utilityMaintenance`;
      if (action === "update")
        return `${baseUrl}/update/utilityMaintenance/${id}`;
      break;

    case "Supplies":
      if (action === "create") return `${baseUrl}/add/supplies`;
      if (action === "update") return `${baseUrl}/update/supplies/${id}`;
      break;

    case "Event Activity":
      if (action === "create") return `${baseUrl}/add/eventActivity`;
      if (action === "update") return `${baseUrl}/update/eventActivity/${id}`;
      break;

    // Add more categories as needed
    default:
      throw new Error(`Category ${category} not supported.`);
  }
};

/**
 * Thunk to fetch all expenses with optional filters and pagination.
 */
export const fetchAllExpenses = createAsyncThunk(
  "expenses/fetchAllExpenses",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData("/finance/expense/getAll", params);

      if (response?.success) {
        return response;
      } else {
        toast.error(response?.message || "Failed to fetch expenses.");
        return rejectWithValue(
          response?.message || "Failed to fetch expenses."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk to add a new expense.
 */
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async ({ values, category }, { dispatch, rejectWithValue }) => {
    try {
      const endpoint = getEndpointForCategory(category, "create");
      const response = await postData(endpoint, values);

      if (response?.success) {
        toast.success("Expense added successfully!");
        return response.data;
      } else {
        dispatch(setShowError(true));
        toast.error(response?.message || "Failed to add expense.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk to update an existing expense.
 */
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ values, category, id }, { dispatch, rejectWithValue }) => {
    try {
      const endpoint = getEndpointForCategory(category, "update", id);
      const response = await putData(endpoint, values);

      if (response?.success) {
        toast.success("Expense updated successfully!");
        return response.data;
      } else {
        dispatch(setShowError(true));
        toast.error(response?.message || "Failed to update expense.");
        return rejectWithValue(
          response?.message || "Failed to update expense."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk to fetch a single expense by ID and category.
 * Optional: Implement if you need to fetch individual expense details.
 */
export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchExpenseById",
  async ({ category, id }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      const endpoint = `/finance/expenses/get/${category}/${id}`;
      const response = await getData(endpoint);

      if (response?.success) {
        return response;
      } else {
        toast.error(response?.message || "Failed to fetch expense.");
        return rejectWithValue(response?.message || "Failed to fetch expense.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
