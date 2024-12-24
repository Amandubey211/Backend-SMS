// src/Store/Slices/Finance/Expenses/expensesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllExpenses,
  addExpense,
  updateExpense,
  fetchExpenseById,
} from "./expensesThunks";

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
  // Optional: Add any statistics fields if needed
  totalExpenseAmount: 0,
  // Add more statistics as required
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
      // Reset statistics
      state.totalExpenseAmount = 0;
      // Reset other statistics as needed
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
      state.currentPage = 1;
    },
    clearFilters(state) {
      state.filters = {};
      state.currentPage = 1;
      // Optionally reset other state related to filters if needed
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
        state.totalRecords = action.payload.totalRecords || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
        // Update statistics if provided
        state.totalExpenseAmount =
          action.payload.totalExpenseAmount || state.totalExpenseAmount;
        // Update other statistics as needed
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch expenses.";
        state.expenses = [];
        state.totalRecords = 0;
        state.totalPages = 0;
        // Reset statistics on error
        state.totalExpenseAmount = 0;
        // Reset other statistics as needed
      })

      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, append the new expense
        state.expenses.unshift(action.payload);
        state.totalRecords += 1;
        // Update statistics
        state.totalExpenseAmount += action.payload.finalAmount || 0;
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
        const index = state.expenses.findIndex(
          (expense) => expense._id === action.payload._id
        );
        if (index !== -1) {
          // Update the expense in the list
          state.expenses[index] = action.payload;
          // Optionally, update statistics
          // Example:
          // state.totalExpenseAmount = recalculateTotalExpenseAmount(state.expenses);
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update expense.";
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
