// src/Store/Slices/Finance/Earnings/earningsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchAllIncomes, addEarnings, updateEarnings } from "./earningsThunks";

const initialState = {
  incomes: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 5,
  filters: {},
  loading: false,
  error: null,
  readOnly: false,
  selectedIncome: null,
  // New statistics fields
  totalRevenue: 0,
  remainingPartialPaidRevenue: 0,
  totalPaidAmount: 0,
  unpaidRevenue: 0,
};

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {
    clearIncomes: (state) => {
      state.incomes = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.filters = {};
      // Reset statistics
      state.totalRevenue = 0;
      state.remainingPartialPaidRevenue = 0;
      state.totalPaidAmount = 0;
      state.unpaidRevenue = 0;
    },
    setSelectedIncome(state, action) {
      state.selectedIncome = action.payload;
    },
    clearSelectedIncome(state) {
      state.selectedIncome = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
      // Optionally reset other state related to filters if needed
    },
    setReadOnly: (state, action) => {
      state.readOnly = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Incomes
      .addCase(fetchAllIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
        // Set the new statistics
        state.totalRevenue = action.payload.totalRevenue || 0;
        state.remainingPartialPaidRevenue =
          action.payload.remainingPartialPaidRevenue || 0;
        state.totalPaidAmount = action.payload.totalPaidAmount || 0;
        state.unpaidRevenue = action.payload.unpaidRevenue || 0;
      })
      .addCase(fetchAllIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch incomes.";
        state.incomes = [];
        state.totalRecords = 0;
        state.totalPages = 0;
        // Reset statistics on error
        state.totalRevenue = 0;
        state.remainingPartialPaidRevenue = 0;
        state.totalPaidAmount = 0;
        state.unpaidRevenue = 0;
      })

      // Add Earnings
      .addCase(addEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEarnings.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you might refresh data or update the store
      })
      .addCase(addEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add earnings.";
      })

      // Update Earnings
      .addCase(updateEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEarnings.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you might refresh data or update the store
      })
      .addCase(updateEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update earnings.";
      });
  },
});

export const {
  setSelectedIncome,
  clearSelectedIncome,
  clearIncomes,
  setCurrentPage,
  setFilters,
  clearFilters,
  setReadOnly,
} = earningsSlice.actions;

export default earningsSlice.reducer;
