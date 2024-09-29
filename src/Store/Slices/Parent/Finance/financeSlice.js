import { createSlice } from "@reduxjs/toolkit";
import { fetchParentFinanceData } from "./finance.action";

const initialState = {
  financeData: [],
  totalUnpaidFees: 0,
  totalPaidFees: 0,
  loading: false,
  error: false,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setFinanceDetails(state, action) {
      state.financeData = action.payload.fees;
      state.totalUnpaidFees = action.payload.totalUnpaidFees;
      state.totalPaidFees = action.payload.totalPaidFees;
    },
    clearError(state) {
      state.error = false;
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
        state.financeData = action.payload.fees;
        state.totalUnpaidFees = action.payload.totalUnpaidFees;
        state.totalPaidFees = action.payload.totalPaidFees;
      })
      .addCase(fetchParentFinanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFinanceDetails, clearError } = financeSlice.actions;
export default financeSlice.reducer;