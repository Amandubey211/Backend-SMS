// src/Store/Slices/Finance/Expenses/expensesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchInvoice } from "./invoice.thunk";

const initialState = {
  invoices: [],
  loading: false,
  error: null,
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Expenses
      .addCase(fetchInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload || [];
        state.error =null
     
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.loading = false;
        state.invoices =  [];
        state.error = action.payload
      })
  },
});

export const {
  clearInvoices,

} = invoiceSlice.actions;

export default invoiceSlice.reducer;
