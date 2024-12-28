import { createSlice } from "@reduxjs/toolkit";
import { cancleReturnInvoiceData, fetchReturnCardData, fetchReturnInvoice } from "./adjustment.thunk";

const initialState = {
  adjustmentData: [],
  currentPage: 0,
  totalPages: 0,
  totalRecords: 0,
  pageSize: 5,
  loading: false,
  error: null, // Changed from boolean to allow storing error messages
  returnCardData: {},
};

const penaltyAdjustmentSlice = createSlice({
  name: "penaltyandAdjustment",
  initialState,
  reducers: {
    // Set the current page for pagination
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Update the page size dynamically
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    // Reset adjustment data and pagination info
    resetAdjustmentData: (state) => {
      state.adjustmentData = [];
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalRecords = 0;
      state.loading = false;
      state.error = null;
    },
    // Clear error messages
    clearError: (state) => {
      state.error = null;
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
        state.error = action.payload || "Failed to fetch return invoice.";
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
      })
      .addCase(cancleReturnInvoiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel return invoice.";
      });
  },
});

export const {
  setCurrentPage,
  setPageSize,
  resetAdjustmentData,
  clearError,
} = penaltyAdjustmentSlice.actions;

export default penaltyAdjustmentSlice.reducer;
