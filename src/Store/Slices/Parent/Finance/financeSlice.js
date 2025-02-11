import { createSlice } from "@reduxjs/toolkit";
import { fetchParentFinanceData } from "./finance.action";

const initialState = {
  financeData: [],
  totalUnpaidFees: 0,
  totalPaidFees: 0,
  loading: false,
  error: null, // Changed to null for better error handling
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setFinanceDetails(state, action) {
      state.financeData = action.payload?.fees || [];
      state.totalUnpaidFees = action.payload?.totalUnpaidFees || 0;
      state.totalPaidFees = action.payload?.totalPaidFees || 0;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentFinanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentFinanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.financeData = action.payload?.fees || [];
        state.totalUnpaidFees = action.payload?.totalUnpaidFees || 0;
        state.totalPaidFees = action.payload?.totalPaidFees || 0;
      })
      .addCase(fetchParentFinanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch finance data";
        state.financeData = []; // Ensure fallback
        state.totalUnpaidFees = 0; // Ensure fallback
        state.totalPaidFees = 0; // Ensure fallback
      });
  },
});

export const { setFinanceDetails, clearError } = financeSlice.actions;
export default financeSlice.reducer;
