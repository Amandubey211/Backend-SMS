import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllReceipts,
  createReceipt,
  cancelReceipt,
  fetchReceiptCardData,
  fetchAllReceiptsReconciliation,
} from "./receiptsThunks";

const initialState = {
  receipts: [], 
  receiptsSummary: {},
  totalCancelRecords:0,
  totalPages:0,
  totalRecords:0,
  loading: false, 
  error: null, 
};

const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  
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
        state.receipts = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalRecords = action.payload.totalRecords || 0;
        state.totalCancelRecords = action.payload.totalCancelRecords || 0;
      })
      .addCase(fetchAllReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch receipts.";
      })

       // Fetch All Receipts
       .addCase(fetchAllReceiptsReconciliation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReceiptsReconciliation.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalRecords = action.payload.totalRecords || 0;
      })
      .addCase(fetchAllReceiptsReconciliation.rejected, (state, action) => {
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
      })
      .addCase(cancelReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel receipt.";
      })
  },
});


export default receiptsSlice.reducer;
