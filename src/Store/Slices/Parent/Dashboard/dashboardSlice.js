import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardCards,
  fetchNotices,
  fetchChildren,
  fetchAccountingData,
} from "./dashboard.action";

const initialState = {
  cardsData: [],
  notices: [],
  childrenData: [],
  accountingData: {
    fees: [],
    totalPaidFees: "0",
    totalUnpaidFees: "0",
  },
  loadingCards: false,
  loadingNotices: false,
  loadingChildren: false,
  loadingAccounting: false,
  errorCards: null,
  errorNotices: null,
  errorChildren: null,
  errorAccounting: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Dashboard Cards
    builder
      .addCase(fetchDashboardCards.pending, (state) => {
        state.loadingCards = true;
        state.errorCards = null;
      })
      .addCase(fetchDashboardCards.fulfilled, (state, action) => {
        state.loadingCards = false;
        state.cardsData = action.payload || [];
      })
      .addCase(fetchDashboardCards.rejected, (state, action) => {
        state.loadingCards = false;
        state.errorCards = action.payload || "Failed to fetch dashboard cards";
        state.cardsData = []; // Ensure fallback
      });

    // Notices
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loadingNotices = true;
        state.errorNotices = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loadingNotices = false;
        state.notices = action.payload || [];
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loadingNotices = false;
        state.errorNotices = action.payload || "Failed to fetch notices";
        state.notices = []; // Ensure fallback
      });

    // Children Data
    builder
      .addCase(fetchChildren.pending, (state) => {
        state.loadingChildren = true;
        state.errorChildren = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loadingChildren = false;
        state.childrenData = action.payload || [];
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loadingChildren = false;
        state.errorChildren = action.payload || "Failed to fetch children data";
        state.childrenData = []; // Ensure fallback
      });

    // Accounting Data
    builder
      .addCase(fetchAccountingData.pending, (state) => {
        state.loadingAccounting = true;
        state.errorAccounting = null;
      })
      .addCase(fetchAccountingData.fulfilled, (state, action) => {
        state.loadingAccounting = false;
        state.accountingData = {
          fees: action.payload?.fees || [],
          totalPaidFees: action.payload?.totalPaidFees || "0",
          totalUnpaidFees: action.payload?.totalUnpaidFees || "0",
        };
      })
      .addCase(fetchAccountingData.rejected, (state, action) => {
        state.loadingAccounting = false;
        state.errorAccounting =
          action.payload || "Failed to fetch accounting data";
        state.accountingData = {
          fees: [],
          totalPaidFees: "0",
          totalUnpaidFees: "0",
        }; // Ensure fallback
      });
  },
});

export default dashboardSlice.reducer;
