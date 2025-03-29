// src/store/finance/Budget /Budget Slice.js
import { createSlice } from "@reduxjs/toolkit";
import { createBudget, fetchBudget, updateBudget } from "./budget.thunk";


const initialState = {
  allBudget: [],
  allBudgetDetails:[],
  allBudgetRequest : [],
  totalRecords:0,
  totalPages:1,
  currentPage: 1,
  loading: false,
  error: null,
  budgetGraph: [],
  budgetCardData:{}
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  extraReducers: (builder) => {
    

    builder
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.allBudget  = action.payload.data || [];
        state.totalRecords= action.payload.totalRecords;
        state.totalPages= action.payload.totalPages;
        state.currentPage= action.payload.currentPage;
       
      })
      .addCase(fetchBudget.rejected, (state, action) => {
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
export default budgetSlice.reducer;
