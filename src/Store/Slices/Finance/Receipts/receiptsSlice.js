import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllReceipts,
  createReceipt,
  cancelReceipt,
  updateReceipt,
  deleteReceipt,
  fetchReceiptCardData,
} from "./receiptsThunks";

const initialState = {
  receipts: [], // Holds all receipts fetched from the API
  receiptsSummary: {}, // Holds the receipt card summary data
  pagination: { // New field to store pagination metadata
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
  loading: false, // Tracks loading state for async actions
  error: null, // Stores error messages
  selectedReceipt: null, // Stores a specific selected receipt
  successMessage: null, // Stores success messages for actions
};

const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    clearReceipts: (state) => {
      state.receipts = [];
      state.receiptsSummary = {};
      state.pagination = { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 };
      state.loading = false;
      state.error = null;
      state.selectedReceipt = null;
      state.successMessage = null;
    },
    setSelectedReceipt(state, action) {
      state.selectedReceipt = action.payload;
    },
    clearSelectedReceipt(state) {
      state.selectedReceipt = null;
    },
    updatePaginationLimit(state, action) {
      state.pagination.limit = action.payload; // Allow changing the limit dynamically
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Receipt Card Data
      .addCase(fetchReceiptCardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceiptCardData.fulfilled, (state, action) => {
        state.loading = false;
        state.receiptsSummary = action.payload || {};
      })
      .addCase(fetchReceiptCardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch receipt card data.";
      })

      // Fetch All Receipts
      .addCase(fetchAllReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload.receipts || [];
        state.pagination = action.payload.pagination || state.pagination; // Update pagination metadata
      })
      .addCase(fetchAllReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch receipts.";
      })

      // Create Receipt
      .addCase(createReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReceipt.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Receipt created successfully!";
      })
      .addCase(createReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create receipt.";
      })

      // Cancel Receipt
      .addCase(cancelReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelReceipt.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Receipt canceled successfully!";
      })
      .addCase(cancelReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel receipt.";
      })

      // Update Receipt
      .addCase(updateReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Receipt updated successfully!";
        const index = state.receipts.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.receipts[index] = action.payload; // Update the receipt in the state
        }
      })
      .addCase(updateReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update receipt.";
      })

      // Delete Receipt
      .addCase(deleteReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Receipt deleted successfully!";
        state.receipts = state.receipts.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete receipt.";
      });
  },
});

export const {
  clearReceipts,
  setSelectedReceipt,
  clearSelectedReceipt,
  updatePaginationLimit,
} = receiptsSlice.actions;

export default receiptsSlice.reducer;
