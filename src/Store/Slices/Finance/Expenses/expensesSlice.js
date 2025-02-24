// src/Store/Slices/Finance/Expenses/expensesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllExpenses,
  addExpense,
  updateExpense,
  fetchExpenseById,
  deleteExpense,
  fetchExpenseGraph,
  fetchCardDataExpense,
  fetchTeachingStaff, // Import the new thunks
  fetchNonTeachingStaff, // Import the new thunks
} from "./expensesThunks"; // Ensure the path is correct

const initialState = {
  expenses: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10, // Adjust as needed
  filters: {},
  loading: false,
  error: null,
  readOnly: false,
  selectedExpense: null,
  totalExpenseAmount: 0, // Optional statistics
  remainingPartialPaidExpense: 0,
  totalPaidAmount: 0,
  unpaidExpense: 0,
  expenseGraph: [], // New state for graph data
  cardDataExpense: {}, // New state for card data
  teachingStaff: [],
  nonTeachingStaff: [],
  teachingStaffLoading: false,
  teachingStaffError: null,
  nonTeachingStaffLoading: false,
  nonTeachingStaffError: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearExpenses: (state) => {
      state.expenses = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.filters = {};
      state.selectedExpense = null;
      state.totalExpenseAmount = 0;
      state.remainingPartialPaidExpense = 0;
      state.totalPaidAmount = 0;
      state.unpaidExpense = 0;
      state.expenseGraph = [];
      state.cardDataExpense = {};
    },
    setSelectedExpense(state, action) {
      state.selectedExpense = action.payload;
    },
    clearSelectedExpense(state) {
      state.selectedExpense = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to the first page on filter change
    },
    clearFilters(state) {
      state.filters = {};
      state.currentPage = 1;
    },
    setReadOnly(state, action) {
      state.readOnly = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Expenses
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalExpenseAmount = action.payload.totalExpense || 0;
        state.remainingPartialPaidExpense =
          action.payload.remainingPartialPaidExpense || 0;
        state.totalPaidAmount = action.payload.totalPaidAmount || 0;
        state.unpaidExpense = action.payload.unpaidExpense || 0;
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.expenses = [];
        state.error =
          action.payload || "An error occurred while fetching expenses.";
      })

      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add expense.";
      })

      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update expense.";
      })

      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || [];
      })

      // Fetch Expense By ID
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload.data || null;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch expense.";
        state.selectedExpense = null;
      })

      // Fetch Expense Graph
      .addCase(fetchExpenseGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseGraph = action.payload || [];
      })
      .addCase(fetchExpenseGraph.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "An error occurred while fetching expense graph data.";
      })

      // Fetch Card Data Expense
      .addCase(fetchCardDataExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardDataExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.cardDataExpense = action.payload || {};
      })
      .addCase(fetchCardDataExpense.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "An error occurred while fetching expense card data.";
      })
      .addCase(fetchTeachingStaff.pending, (state) => {
        state.teachingStaffLoading = true;
        state.teachingStaffError = null;
      })
      .addCase(fetchTeachingStaff.fulfilled, (state, action) => {
        state.teachingStaffLoading = false;
        state.teachingStaff = action.payload;
      })
      .addCase(fetchTeachingStaff.rejected, (state, action) => {
        state.teachingStaffLoading = false;
        state.teachingStaffError =
          action.payload || "Failed to fetch teaching staff.";
      })

      // Fetch Non-Teaching Staff
      .addCase(fetchNonTeachingStaff.pending, (state) => {
        state.nonTeachingStaffLoading = true;
        state.nonTeachingStaffError = null;
      })
      .addCase(fetchNonTeachingStaff.fulfilled, (state, action) => {
        state.nonTeachingStaffLoading = false;
        state.nonTeachingStaff = action.payload;
      })
      .addCase(fetchNonTeachingStaff.rejected, (state, action) => {
        state.nonTeachingStaffLoading = false;
        state.nonTeachingStaffError =
          action.payload || "Failed to fetch non-teaching staff.";
      });
  },
});

export const {
  clearExpenses,
  setSelectedExpense,
  clearSelectedExpense,
  setCurrentPage,
  setFilters,
  clearFilters,
  setReadOnly,
} = expensesSlice.actions;

export default expensesSlice.reducer;
