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
      })
      .addCase(fetchAllIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch incomes.";
        state.incomes = [];
        state.totalRecords = 0;
        state.totalPages = 0;
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
  clearIncomes,
  setCurrentPage,
  setFilters,
  clearFilters,
  setReadOnly,
} = earningsSlice.actions;

export default earningsSlice.reducer;
