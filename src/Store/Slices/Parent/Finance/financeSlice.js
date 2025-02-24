import { createSlice } from "@reduxjs/toolkit";
import { fetchParentFeeBreakdown, fetchParentFinanceData } from "./finance.action";

const initialState = {
  financeData: [],
  totalUnpaidFees: 0,
  totalPaidFees: 0,
  feeBreakdown: [],
  loading: false,
  error: null,
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
    setFeeBreakdown(state, action) {
      state.feeBreakdown = action.payload || [];
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
        state.financeData = [];
        state.totalUnpaidFees = 0;
        state.totalPaidFees = 0;
      })
      .addCase(fetchParentFeeBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentFeeBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.feeBreakdown = action.payload?.feeBreakdown || [];
      })
      .addCase(fetchParentFeeBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch fee breakdown";
      });
  },
});

export const { setFinanceDetails, setFeeBreakdown, clearError } = financeSlice.actions;
export default financeSlice.reducer;
