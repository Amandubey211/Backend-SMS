// src/Store/Slices/${getRole}/Expenses/expensesThunks.js

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
import { getUserRole } from "../../../../Utils/getRoles";

/**
 * Helper function to determine the correct API endpoints based on expense category.
 */
const getEndpointForCategory = (getRole,category, action, expenseId) => {
  const baseUrl = `/${getRole}/expense`;
  // console.log(category, "kk");
  switch (category) {
    case "Salaries and Wages":
      if (action === "create") return `${baseUrl}/add/salaryWages`;
      if (action === "update")
        return `${baseUrl}/edit/salaryWages/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/salaryWages/${expenseId}`;
      break;

    case "Utilities and Maintenance":
      if (action === "create") return `${baseUrl}/add/utilityMaintenance`;
      if (action === "update")
        return `${baseUrl}/edit/utilityMaintenance/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/utilityMaintenance/${expenseId}`;
      break;

    case "Supplies":
      if (action === "create") return `${baseUrl}/add/supplies`;
      if (action === "update") return `${baseUrl}/edit/supplies/${expenseId}`;
      if (action === "delete") return `${baseUrl}/delete/supplies/${expenseId}`;
      break;

    case "Event and Activity Costs":
      if (action === "create") return `${baseUrl}/add/eventActivity`;
      if (action === "update")
        return `${baseUrl}/edit/eventActivity/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/eventActivity/${expenseId}`;
      break;

    case "Library and Academic Resources":
      if (action === "create") return `${baseUrl}/add/libraryAcademic`;
      if (action === "update")
        return `${baseUrl}/edit/libraryAcademic/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/libraryAcademic/${expenseId}`;
      break;

    case "Marketing and Advertising":
      if (action === "create") return `${baseUrl}/add/marketingAd`;
      if (action === "update")
        return `${baseUrl}/edit/marketingAd/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/marketingAd/${expenseId}`;
      break;

    case "Miscellaneous":
      if (action === "create") return `${baseUrl}/add/miscellaneous`;
      if (action === "update")
        return `${baseUrl}/edit/miscellaneous/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/miscellaneous/${expenseId}`;
      break;

    case "IT and Software":
      if (action === "create") return `${baseUrl}/add/software`;
      if (action === "update") return `${baseUrl}/edit/software/${expenseId}`;
      if (action === "delete") return `${baseUrl}/delete/software/${expenseId}`;

    case "Examination and Affiliation": // New Category Added
      if (action === "create") return `${baseUrl}/add/examAffiliatione`;
      if (action === "update")
        return `${baseUrl}/edit/examAffiliatione/${expenseId}`;
      if (action === "delete")
        return `${baseUrl}/delete/examAffiliatione/${expenseId}`;
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
  async (params, { dispatch, rejectWithValue,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/getAll?academicYear=${say}`,
        params
      );

      if (response?.success) {
        return response;
      } else {
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
  async ({ values, category }, { dispatch, rejectWithValue,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const endpoint = getEndpointForCategory(getRole,category, "create");
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

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ values, category, expenseId }, { dispatch, rejectWithValue ,getState}) => {
    try {
      const getRole = getUserRole(getState);
      const endpoint = getEndpointForCategory(getRole,category, "update", expenseId);
      const response = await putData(endpoint, values);

      if (response?.success) {
        toast.success("Expense updated successfully!");
        return response.data;
      } else {
        dispatch(setShowError(true));
        toast.error(response?.message || "Failed to update expense.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async ({ category, id }, { dispatch, rejectWithValue, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const endpoint = getEndpointForCategory(getRole,category, "delete", id);
      const response = await deleteData(endpoint);

      if (response?.success) {
        const state = getState();
        const { currentPage, computedPageSize, filters } = state.admin.expenses;

        const params = {
          page: currentPage,
          limit: computedPageSize,
          includeDetails: true,
          ...filters,
        };

        await dispatch(fetchAllExpenses(params)); // Refetch the expenses list
       // toast.success("Expense deleted successfully!");
        return { id, category };
      } else {
        toast.error(response?.message || "Failed to delete expense.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchExpenseById",
  async ({ category, id }, { dispatch, rejectWithValue ,getState}) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY();
      dispatch(setShowError(false));
      const endpoint = `/${getRole}/expense/get/${category}/${id}`;
      const response = await getData(endpoint);

      if (response?.success) {
        return response;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchExpenseGraph = createAsyncThunk(
  "expenses/fetchExpenseGraph",
  async ({ groupBy = "month" }, { rejectWithValue, dispatch,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY(); // Academic Year Identifier
      dispatch(setShowError(false));
      const response = await getData(`/${getRole}/dashboard/expense/graph`, {
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

export const fetchCardDataExpense = createAsyncThunk(
  "expenses/fetchCardDataExpense",
  async ({ year }, { rejectWithValue, dispatch,getState }) => {
    try {
      const getRole = getUserRole(getState);
      const say = getAY(); // Academic Year Identifier
      dispatch(setShowError(false));
      const response = await getData(`/${getRole}/dashboard/expense/cardData`, {
        academicYearId: say,
        year,
      });

      if (response?.success) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchTeachingStaff = createAsyncThunk(
  "expenses/fetchTeachingStaff",
  async (_, { dispatch, rejectWithValue ,getState}) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(`admin/teachingStaff`);

      if (response?.success) {
        return response.data; // Assuming data is the array of teaching staff
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchNonTeachingStaff = createAsyncThunk(
  "expenses/fetchNonTeachingStaff",
  async (_, { dispatch, rejectWithValue ,getState}) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(`/admin/nonTeachingStaff`);

      if (response?.success) {
        return response.data; // Assuming data is the array of non-teaching staff
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
