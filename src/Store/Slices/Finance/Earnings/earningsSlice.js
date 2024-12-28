// src/Store/Slices/Finance/Earnings/earningsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllIncomes,
  addEarnings,
  updateEarnings,
  fetchEarningGraph,
  fetchCardDataRevenue,
} from "./earningsThunks";

const initialState = {
  incomes: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 5,
  filters: {},
  loading: false,

  error: null,
  graphLoading: false,
  graphError: false,
  readOnly: false,
  selectedIncome: null,
  totalRevenue: 0,
  remainingPartialPaidRevenue: 0,
  totalPaidAmount: 0,
  unpaidRevenue: 0,
  // New state fields for dynamic data
  expenseGraph: [],
  cardDataRevenue: [],
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
      state.selectedIncome = null;
      // Reset statistics
      state.totalRevenue = 0;
      state.remainingPartialPaidRevenue = 0;
      state.totalPaidAmount = 0;
      state.unpaidRevenue = 0;
      // Reset dynamic data
      state.expenseGraph = [];
      state.cardDataRevenue = [];
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
        state.totalRevenue = 0;
        state.remainingPartialPaidRevenue = 0;
        state.totalPaidAmount = 0;
        state.unpaidRevenue = 0;
        state.graphError = false;
        state.graphLoading = false;
      })

      // Add Earnings
      .addCase(addEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEarnings.fulfilled, (state, action) => {
        state.loading = false;
        // // Optionally, you might refresh data or update the store
        // // For example, prepend the new income to the incomes array
        // state.incomes.unshift(action.payload);
        // state.totalRecords += 1;
        // // Update statistics
        // state.totalRevenue += action.payload.final_amount || 0;
        // state.totalPaidAmount += action.payload.paid_amount || 0;
        // state.unpaidRevenue += action.payload.remaining_amount || 0;
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
        // Optionally, update the specific income in the incomes array
        // const index = state.incomes.findIndex(
        //   (income) => income._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.incomes[index] = action.payload;
        //   // Recalculate statistics if necessary
        //   state.totalRevenue = state.incomes.reduce(
        //     (acc, income) => acc + (income.final_amount || 0),
        //     0
        //   );
        //   state.totalPaidAmount = state.incomes.reduce(
        //     (acc, income) => acc + (income.paid_amount || 0),
        //     0
        //   );
        //   state.unpaidRevenue = state.incomes.reduce(
        //     (acc, income) => acc + (income.remaining_amount || 0),
        //     0
        //   );
        // }
      })
      .addCase(updateEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update earnings.";
      })

      // Fetch Expense Graph
      .addCase(fetchEarningGraph.pending, (state) => {
        state.graphLoading = true;
        state.graphError = null;
      })
      .addCase(fetchEarningGraph.fulfilled, (state, action) => {
        state.graphLoading = false;
        state.expenseGraph = action.payload || [];
      })
      .addCase(fetchEarningGraph.rejected, (state, action) => {
        state.graphLoading = false;
        state.graphError =
          action.payload || "Failed to fetch expense graph data.";
      })

      // Fetch Card Data Revenue
      // Fetch Card Data Revenue
      .addCase(fetchCardDataRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardDataRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.cardDataRevenue = action.payload || {};
      })
      .addCase(fetchCardDataRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch card data revenue.";
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
