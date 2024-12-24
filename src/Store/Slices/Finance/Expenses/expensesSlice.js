// src/Store/Slices/Finance/Expenses/expensesSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  readOnly: false,
  loading: false,
  error: null,
  selectedExpense: null, // For editing/viewing a specific expense
};

const expensesSlice = createSlice({
  name: "admin/expenses",
  initialState,
  reducers: {
    setReadOnly(state, action) {
      state.readOnly = action.payload;
    },
    setSelectedExpense(state, action) {
      state.selectedExpense = action.payload;
    },
    clearSelectedExpense(state) {
      state.selectedExpense = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setReadOnly,
  setSelectedExpense,
  clearSelectedExpense,
  setLoading,
  setError,
  clearError,
} = expensesSlice.actions;

export default expensesSlice.reducer;
