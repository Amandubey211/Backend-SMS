import { createSlice } from "@reduxjs/toolkit";
import { StudentFinanceDetails } from "./finance.action";

const initialState = {
  stdFinanceData: [],
  totalUnpaidFees: `0 QR`,
  totalPaidFees: `0 QR`,
  loading: false,
  error: false,
  filters: {
    feesType: "",
    status: "Everyone",
  },
};

const financeSlice = createSlice({
  name: "studentFinance",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(StudentFinanceDetails.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(StudentFinanceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.stdFinanceData = action.payload.fees;
        state.totalPaidFees = action.payload.totalPaidFees;
        state.totalUnpaidFees = action.payload.totalUnpaidFees;
      })
      .addCase(StudentFinanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { setFilters } = financeSlice.actions;
export default financeSlice.reducer;
