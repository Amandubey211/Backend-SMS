// src/Store/Slices/Finance/Adjustments/penaltyAdjustmentSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  cancleReturnInvoiceData,
  fetchReturnCardData,
  fetchReturnInvoice,
  createAdjustment,
} from "./adjustment.thunk";

const initialState = {
  adjustmentData: [],
  currentPage: 0,
  totalPages: 0,
  totalRecords: 0,
  pageSize: 5,
  loading: false,
  error: null, // Changed from boolean to store error messages
  returnCardData: {},
  successMessage: null, // To store success messages
};

const penaltyAdjustmentSlice = createSlice({
  name: "penaltyandAdjustment",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    resetAdjustmentData: (state) => {
      state.adjustmentData = [];
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalRecords = 0;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Return Invoice
      .addCase(fetchReturnInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.adjustmentData = action.payload?.adjustments || [];
        state.currentPage = action.payload?.currentPage || 0;
        state.totalPages = action.payload?.totalPages || 0;
        state.totalRecords = action.payload?.totalAdjustments || 0;
      })
      .addCase(fetchReturnInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch return invoices.";
      })

      // Fetch Return Card Data
      .addCase(fetchReturnCardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnCardData.fulfilled, (state, action) => {
        state.loading = false;
        state.returnCardData = action.payload || {};
      })
      .addCase(fetchReturnCardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch return card data.";
      })

      // Cancel Return Invoice Data
      .addCase(cancleReturnInvoiceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancleReturnInvoiceData.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Return invoice canceled successfully!";
        // Optionally, remove the canceled invoice from adjustmentData
        // Example:
        // state.adjustmentData = state.adjustmentData.filter(item => item._id !== action.payload.id);
      })
      .addCase(cancleReturnInvoiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel return invoice.";
      })

      // Create Adjustment
      .addCase(createAdjustment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAdjustment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Adjustment created successfully!";
        state.adjustmentData.unshift(action.payload.adjustment); // Assuming the API returns the created adjustment
        state.totalRecords += 1;
      })
      .addCase(createAdjustment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create adjustment.";
      });
  },
});

export const {
  setCurrentPage,
  setPageSize,
  resetAdjustmentData,
  clearError,
  clearSuccessMessage,
} = penaltyAdjustmentSlice.actions;

export default penaltyAdjustmentSlice.reducer;
