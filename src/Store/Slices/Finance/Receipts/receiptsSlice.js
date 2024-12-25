import { createSlice } from "@reduxjs/toolkit";
import { fetchAllReceipts, createReceipt, cancelReceipt } from "./receiptsThunks";

const initialState = {
  receipts: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 5,
  filters: {},
  loading: false,
  error: null,
  selectedReceipt: null,
  successMessage: null,
};

const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    clearReceipts: (state) => {
      state.receipts = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.filters = {};
    },
    setSelectedReceipt(state, action) {
      state.selectedReceipt = action.payload;
    },
    clearSelectedReceipt(state) {
      state.selectedReceipt = null;
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
        state.receipts = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
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
      });
  },
});

export const {
  clearReceipts,
  setSelectedReceipt,
  clearSelectedReceipt,
  setCurrentPage,
  setFilters,
  clearFilters,
} = receiptsSlice.actions;

export default receiptsSlice.reducer;
