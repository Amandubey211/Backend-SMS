// src/store/finance/slices/earningsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllIncomes } from "./earningsThunks";

const initialState = {
  incomes: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {
    // Optional: Define synchronous actions here
    clearIncomes: (state) => {
      state.incomes = [];
      state.totalRecords = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload?.data;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAllIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch incomes.";
      });
  },
});

export const { clearIncomes, setCurrentPage } = earningsSlice.actions;

export default earningsSlice.reducer;
