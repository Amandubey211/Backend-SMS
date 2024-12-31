import { createSlice } from "@reduxjs/toolkit";
import { fetchInvoice, fetchInvoiceCard, fetchInvoiceByNumber } from "./invoice.thunk";

const initialState = {
  invoices: [],
  invoiceDetails: null,
  cardData: {},
  invoiceData: {},
  selectedInvoiceNumber: null, // Stores the selected invoice number
  loading: false,
  error: null, // Stores error messages
  invoiceFetchSuccess: false, // Indicates if invoice fetch was successful
  pagination: {}, // Pagination details
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    // Clear all invoices
    clearInvoices: (state) => {
      state.invoices = [];
      state.loading = false;
      state.error = null;
    },

    // Clear invoice details
    clearInvoiceDetails: (state) => {
      state.invoiceDetails = null;
    },

    // Set invoice data for editing or viewing
    setInvoiceData: (state, action) => {
      state.invoiceData = action.payload;
    },

    // Set selected invoice number for navigation or pre-filling
    setSelectedInvoiceNumber: (state, action) => {
      state.selectedInvoiceNumber = action.payload;
    },

    // Clear selected invoice number to prevent unintended pre-filling
    clearSelectedInvoiceNumber: (state) => {
      state.selectedInvoiceNumber = null;
    },

    // Clear invoice fetch success flag
    clearInvoiceFetchSuccess: (state) => {
      state.invoiceFetchSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(fetchInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data || [];
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.loading = false;
        state.invoices = [];
        state.error = action.payload;
      })

      // Fetch invoice card
      .addCase(fetchInvoiceCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cardData = action.payload || {};
        state.error = null;
      })
      .addCase(fetchInvoiceCard.rejected, (state, action) => {
        state.loading = false;
        state.cardData = {};
        state.error = action.payload;
      })

      // Fetch invoice by number
      .addCase(fetchInvoiceByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.invoiceFetchSuccess = false; // Reset success flag during fetch
      })
      .addCase(fetchInvoiceByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceDetails = action.payload;
        state.invoiceFetchSuccess = true; // Mark fetch as successful
        state.error = null;
      })
      .addCase(fetchInvoiceByNumber.rejected, (state, action) => {
        state.loading = false;
        state.invoiceDetails = null;
        state.invoiceFetchSuccess = false; // Reset success flag on error
        state.error = action.payload;
      });
  },
});

// Exporting actions
export const {
  clearInvoices,
  setInvoiceData,
  clearInvoiceDetails,
  setSelectedInvoiceNumber,
  clearSelectedInvoiceNumber,
  clearInvoiceFetchSuccess,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
