// src/store/finance/OperationalExpense/OperationalExpenseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createOperationalExpense, fetchOperationalExpenses, fetchOperationalExpensesGraph, updateOperationalExpenses } from "./operationalExpenses.thunk";


const initialState = {
  allOperationalExpense: [],
  totalRecords:0,
  totalPages:1,
  currentPage: 1,
  paidAllAmount:0,
  totalAllAmount:0,
  fee: null,
  loading: false,
  error: null,
  OperationalExpenseGraphData: [],
  OperationalExpenseCardData:{}
};

const OperationalExpenseSlice = createSlice({
  name: "OperationalExpense",
  initialState,
  extraReducers: (builder) => {
    

    builder
      .addCase(fetchOperationalExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationalExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.allOperationalExpense = action.payload?.data || [];
        state.totalRecords= action.payload?.totalRecords;
        state.totalPages= action.payload?.totalPages;
        state.currentPage= action.payload?.currentPage;
        state.paidAllAmount= action.payload?.paidAllAmount;
        state.totalAllAmount = action.payload?.totalAllAmount;
       
      })
      .addCase(fetchOperationalExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
     

    // Create student fee
    builder
      .addCase(createOperationalExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOperationalExpense.fulfilled, (state, action) => {
        state.loading = false;
        //state.fees.push(action.payload.data);
      })
      .addCase(createOperationalExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    
    
    builder
      .addCase(updateOperationalExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOperationalExpenses.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateOperationalExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    builder
      .addCase( fetchOperationalExpensesGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperationalExpensesGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.OperationalExpenseGraphData = action.payload?.data;
      })
      .addCase(fetchOperationalExpensesGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

  },
});
export default OperationalExpenseSlice.reducer;
