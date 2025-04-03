// src/store/finance/Payroll/PayrollSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createPayroll,  fetchPayroll, fetchPayrollGraph, updatePayroll } from "./payroll.thunk";


const initialState = {
  allPayroll: [],
  PayrollGraphData: [],
  totalRecords:0,
  totalPages:1,
  currentPage: 1,
  paidAllAmount:0,
  totalAllAmount:0,
  fee: null,
  loading: false,
  error: null,
  PayrollCardData:{}
};

const PayrollSlice = createSlice({
  name: "Payroll",
  initialState,
  extraReducers: (builder) => {
    

    builder
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayroll = action.payload.data || [];
        state.totalRecords= action.payload.totalRecords;
        state.totalPages= action.payload.totalPages;
        state.currentPage= action.payload.currentPage;
        state.paidAllAmount= action.payload.paidAllAmount;
        state.totalAllAmount = action.payload.totalAllAmount;
       
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
     

    // Create student fee
    builder
      .addCase(createPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.loading = false;
        //state.fees.push(action.payload.data);
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    
    
    builder
      .addCase(updatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayroll.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    builder
      .addCase(fetchPayrollGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.PayrollGraphData = action.payload?.data;
      })
      .addCase(fetchPayrollGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

  },
});
export default PayrollSlice.reducer;
