// src/store/finance/Budget /Budget Slice.js
import { createSlice } from "@reduxjs/toolkit";
import { createBudget, fetchBudget, fetchBudgetGraph, fetchBudgetsummary, updateBudget } from "./budget.thunk";
const initialState = {
  allBudget: [],
  allBudgetDetails:[],
  allBudgetRequest : [],
  selectedFinancialYear:{},
  totalRecords:0,
  totalPages:1,
  currentPage: 1,
  loading: false,
  error: null,
  budgetGraph: [],
  budgetCardData:{},
  graphData:{
    loading: false,
    error: null,
    data:[],
    totalBudget:0,
    totalSpend:0,
  }
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers:{
    setSelectedFinancialYear(state, action) {
      state.selectedFinancialYear = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.allBudget  = action.payload?.data || [];
        state.totalRecords= action.payload?.totalRecords;
        state.totalPages= action.payload?.totalPages;
        state.currentPage= action.payload?.currentPage;
       
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    builder
      .addCase(fetchBudgetGraph.pending, (state) => {
        state.graphData.loading = true;
        state.graphData.error = null;
      })
      .addCase(fetchBudgetGraph.fulfilled, (state, action) => {
        state.graphData.loading = false;
        state.graphData.data  = action.payload.data || [];
        state.graphData.totalBudget  = action.payload.totalBudget || 0;
        state.graphData.totalSpend  = action.payload.totalSpend || 0;
       
      })
      .addCase(fetchBudgetGraph.rejected, (state, action) => {
        state.graphData.loading = false;
        state.graphData.error = action.payload || action.error.message;
      });

    builder
      .addCase(fetchBudgetsummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetsummary.fulfilled, (state, action) => {
        state.loading = false;
        state.allBudgetDetails  = action.payload?.data || [];
        state.totalRecords= action.payload?.totalRecords;
        state.totalPages= action.payload?.totalPages;
        state.currentPage= action.payload?.currentPage;
       
      })
      .addCase(fetchBudgetsummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Create student fee
    builder
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        //state.fees.push(action.payload.data);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    
    
    builder
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

  },
});
export const { setSelectedFinancialYear } =
budgetSlice.actions;
export default budgetSlice.reducer;
