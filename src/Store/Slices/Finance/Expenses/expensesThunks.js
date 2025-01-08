// src/Store/Slices/Finance/Expenses/expensesThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../services/apiEndpoints"; // Ensure deleteData is implemented
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";

/**
 * Helper function to determine the correct API endpoints based on expense category.
 */
const getEndpointForCategory = (category, action, id) => {
  const baseUrl = "/finance/expense";

  switch (category) {
    case "Salaries and Wages":
      if (action === "create") return `${baseUrl}/add/salaryWages`;
      if (action === "update") return `${baseUrl}/update/salaryWages/${id}`;
      if (action === "delete") return `${baseUrl}/delete/salaryWages/${id}`;
      break;

    case "Utilities and Maintenance":
      if (action === "create") return `${baseUrl}/add/utilityMaintenance`;
      if (action === "update")
        return `${baseUrl}/update/utilityMaintenance/${id}`;
      if (action === "delete")
        return `${baseUrl}/delete/utilityMaintenance/${id}`;
      break;

    case "Supplies":
      if (action === "create") return `${baseUrl}/add/supplies`;
      if (action === "update") return `${baseUrl}/update/supplies/${id}`;
      if (action === "delete") return `${baseUrl}/delete/supplies/${id}`;
      break;

    case "Event and Activity Costs":
      if (action === "create") return `${baseUrl}/add/eventActivity`;
      if (action === "update") return `${baseUrl}/update/eventActivity/${id}`;
      if (action === "delete") return `${baseUrl}/delete/eventActivity/${id}`;
      break;

    case "Library and Academic Resources":
      if (action === "create") return `${baseUrl}/add/libraryAcademic`;
      if (action === "update") return `${baseUrl}/edit/libraryAcademic/${id}`;
      if (action === "delete") return `${baseUrl}/delete/libraryAcademic/${id}`;
      break;

    case "Marketing and Advertising":
      if (action === "create") return `${baseUrl}/add/marketingAd`;
      if (action === "update") return `${baseUrl}/edit/marketingAd/${id}`;
      if (action === "delete") return `${baseUrl}/delete/marketingAd/${id}`;
      break;

    case "Miscellaneous":
      if (action === "create") return `${baseUrl}/add/miscellaneous`;
      if (action === "update") return `${baseUrl}/edit/miscellaneous/${id}`;
      if (action === "delete") return `${baseUrl}/delete/miscellaneous/${id}`;
      break;

    case "IT and Software":
      if (action === "create") return `${baseUrl}/add/software`;
      if (action === "update") return `${baseUrl}/edit/software/${id}`;
      if (action === "delete") return `${baseUrl}/delete/software/${id}`;

    case "Examination and Affiliation": // New Category Added
      if (action === "create") return `${baseUrl}/add/examAffiliatione`;
      if (action === "update") return `${baseUrl}/edit/examAffiliatione/${id}`;
      if (action === "delete")
        return `${baseUrl}/delete/examAffiliatione/${id}`;
      break;

    // Add more categories as needed
    default:
      toast.error(`Category ${category} not supported.`);
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
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/finance/expense/getAll?academicYear=${say}`,
        params
      );

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
        return rejectWithValue(response?.message || "Failed to add expense.");
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
 * Thunk to delete an existing expense.
 */
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async ({ category, id }, { dispatch, rejectWithValue }) => {
    try {
      const endpoint = getEndpointForCategory(category, "delete", id);
      const response = await deleteData(endpoint);

      if (response?.success) {
        toast.success("Expense deleted successfully!");
        return { id, category };
      } else {
        dispatch(setShowError(true));
        toast.error(response?.message || "Failed to delete expense.");
        return rejectWithValue(
          response?.message || "Failed to delete expense."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchExpenseById",
  async ({ category, id }, { dispatch, rejectWithValue }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const endpoint = `/finance/expense/get/${category}/${id}`;
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

export const fetchExpenseGraph = createAsyncThunk(
  "expenses/fetchExpenseGraph",
  async ({ groupBy = "month" }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY(); // Academic Year Identifier
      dispatch(setShowError(false));
      const response = await getData("/finance/dashboard/expense/graph", {
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

export const fetchCardDataExpense = createAsyncThunk(
  "expenses/fetchCardDataExpense",
  async ({ year }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY(); // Academic Year Identifier
      dispatch(setShowError(false));
      const response = await getData(`/finance/dashboard/expense/cardData`, {
        academicYearId: say,
        year,
      });

      if (response?.success) {
        return response.data;
      } else {
        toast.error(
          response?.message || "Failed to fetch card data for expenses."
        );
        return rejectWithValue(
          response?.message || "Failed to fetch card data for expenses."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchTeachingStaff = createAsyncThunk(
  "expenses/fetchTeachingStaff",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData("/admin/teachingStaff");

      if (response?.success) {
        return response.data; // Assuming data is the array of teaching staff
      } else {
        toast.error(response?.msg || "Failed to fetch teaching staff.");
        return rejectWithValue(
          response?.msg || "Failed to fetch teaching staff."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk to fetch Non-Teaching Staff
 */
export const fetchNonTeachingStaff = createAsyncThunk(
  "expenses/fetchNonTeachingStaff",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData("/admin/nonTeachingStaff");

      if (response?.success) {
        return response.data; // Assuming data is the array of non-teaching staff
      } else {
        toast.error(response?.msg || "Failed to fetch non-teaching staff.");
        return rejectWithValue(
          response?.msg || "Failed to fetch non-teaching staff."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
