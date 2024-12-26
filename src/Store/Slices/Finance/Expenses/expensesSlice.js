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
  totalExpenseAmount: 0, // Optional statistics
  remainingPartialPaidExpense: 0,
  totalPaidAmount: 0,
  unpaidExpense: 0,
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
        state.totalExpense = action.payload.totalExpense;
        state.remainingPartialPaidExpense =
          action.payload.remainingPartialPaidExpense;
        state.totalPaidAmount = action.payload.totalPaidAmount;
        state.unpaidExpense = action.payload.unpaidExpense;
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
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
        // state.expenses.unshift(action.payload); // Add new expense to the start
        // state.totalRecords += 1;

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
        // const index = state.expenses.findIndex(
        //   (expense) => expense._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.expenses[index] = action.payload; // Update the expense

        //   // Optionally, update statistics
        //   const updatedAmount = action.payload.finalAmount || 0;
        //   const previousAmount = state.expenses[index]?.finalAmount || 0;
        //   state.totalExpenseAmount += updatedAmount - previousAmount;
        // }
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
