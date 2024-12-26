import { createSlice } from "@reduxjs/toolkit";
import { fetchAllQuotations, createQuotation, cancelQuotation } from "./quotationThunks";

const initialState = {
  quotations: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 5,
  filters: {},
  loading: false,
  error: null,
  selectedQuotation: null,
  successMessage: null,
};

const quotationSlice = createSlice({
  name: "quotations",
  initialState,
  reducers: {
    clearQuotations: (state) => {
      state.quotations = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.filters = {};
    },
    setSelectedQuotation(state, action) {
      state.selectedQuotation = action.payload;
    },
    clearSelectedQuotation(state) {
      state.selectedQuotation = null;
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
      // Fetch All Quotations
      .addCase(fetchAllQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuotations.fulfilled, (state, action) => {
        console.log("Fulfilled payload:", action.payload);
        state.loading = false;
        state.quotations = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchAllQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quotations.";
      })

      // Create Quotation
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Quotation created successfully!";
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create quotation.";
      })

      // Cancel Quotation
      .addCase(cancelQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelQuotation.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Quotation canceled successfully!";
      })
      .addCase(cancelQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel quotation.";
      });
  },
});

export const {
  clearQuotations,
  setSelectedQuotation,
  clearSelectedQuotation,
  setCurrentPage,
  setFilters,
  clearFilters,
} = quotationSlice.actions;

export default quotationSlice.reducer;
