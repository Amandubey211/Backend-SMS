// src/Store/Slices/Finance/Expenses/expensesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchInvoice, fetchInvoiceCard, fetchInvoiceByNumber } from "./invoice.thunk";

const initialState = {
  invoices: [],
  invoiceDetails: null,
  cardData: {},
  loading: false,
  error: null,
  pagination: {},
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    clearInvoices: (state) => {
      state.invoices = [];
      state.loading = false;
      state.error = null;
    },
    clearInvoiceDetails: (state) => { // Added for clearing specific invoice details
      state.invoiceDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Invoices
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
      // Fetch Invoice Card
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
      // Fetch Invoice by Number
      .addCase(fetchInvoiceByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchInvoiceByNumber.rejected, (state, action) => {
        state.loading = false;
        state.invoiceDetails = null;
        state.error = action.payload;
      });
  },
});

export const { clearInvoices, clearInvoiceDetails } = invoiceSlice.actions;

export default invoiceSlice.reducer;
