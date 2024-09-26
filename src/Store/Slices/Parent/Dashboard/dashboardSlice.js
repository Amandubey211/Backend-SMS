import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardCards,
  fetchNotices,
  fetchChildren,
  fetchAccountingData
} from "./dashboard.action";

const initialState = {
  dashboardData: null,  // Will hold the cards and notices, etc.
  cardsData: null,
  notices: [],
  childrenData: [],
  accountingData: {
    fees: [],
    totalPaidFees: "",
    totalUnpaidFees: "",
  },
  loading: false,
  error: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Dashboard Cards
    builder
      .addCase(fetchDashboardCards.fulfilled, (state, action) => {
        state.cardsData = action.payload;  // Make sure action.payload is being passed correctly
        state.loading = false;
        console.log("Fetched card data:", action.payload);
      })
      .addCase(fetchDashboardCards.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchDashboardCards.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // Notices
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Children Data
    builder
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.childrenData = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Accounting Data
    builder
      .addCase(fetchAccountingData.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAccountingData.fulfilled, (state, action) => {
        state.loading = false;
        state.accountingData = {
          fees: action.payload.fees,
          totalPaidFees: action.payload.totalPaidFees,
          totalUnpaidFees: action.payload.totalUnpaidFees,
        };
      })
      .addCase(fetchAccountingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
