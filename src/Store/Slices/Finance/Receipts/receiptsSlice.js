import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllReceipts,
  createReceipt,
  cancelReceipt,
  updateReceipt,
  deleteReceipt,
} from "./receiptsThunks";

const initialState = {
  receipts: [], // Holds all receipts fetched from the API
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Receipts
      .addCase(fetchAllReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload.receipts || [];
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
      .addCase(createReceipt.fulfilled, (state, action) => {
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
      .addCase(cancelReceipt.fulfilled, (state, action) => {
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
        state.receipts = state.receipts.filter((r) => r._id !== action.payload); // Remove from state
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
} = receiptsSlice.actions;

export default receiptsSlice.reducer;
