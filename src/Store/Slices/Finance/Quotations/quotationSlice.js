import { createSlice } from "@reduxjs/toolkit";
import { fetchAllQuotations, addQuotation, cancelQuotation, fetchQuotationCardData, updateQuotationStatus } from "./quotationThunks";

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
  totalQuotations: 0,
  acceptedQuotations: 0,
  rejectedQuotations: 0,
  pendingQuotations: 0
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
      .addCase(addQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuotation.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Quotation created successfully!";
      })
      .addCase(addQuotation.rejected, (state, action) => {
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
      })

      // fetch dashboard cards
      .addCase(fetchQuotationCardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationCardData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalQuotations = action.payload.totalQuotations;
        state.acceptedQuotations = action.payload.acceptedQuotations;
        state.rejectedQuotations = action.payload.rejectedQuotations;
        state.pendingQuotations = action.payload.pendingQuotations;
      })
      .addCase(fetchQuotationCardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quotation cardData.";
      })

      .addCase(updateQuotationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedQuotation = action.payload;
        console.log("updatedQuotation", updatedQuotation);

        // Update the specific quotation in the state
        const index = state.quotations.findIndex((quotation) => quotation._id === updatedQuotation._id);
        if (index !== -1) {
          state.quotations[index] = updatedQuotation;
        }
        // Update the count for the status
        if (updatedQuotation.status === 'accept') {
          state.acceptedQuotations += 1;
          state.pendingQuotations -= 1;
        } else if (updatedQuotation.status === 'reject') {
          state.rejectedQuotations += 1;
          state.pendingQuotations -= 1;
        }
      })
      .addCase(updateQuotationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quotation status.";
      })

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
