// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStudentFees,
  fetchOneStudentFee,
  createStudentFee,
  updateStudentFee,
  deleteStudentFees,
} from "./studentFeesThunks";

const initialState = {
  fees: [],
  fee: null,
  loading: false,
  error: null,
};

const studentFeesSlice = createSlice({
  name: "studentFees",
  initialState,
  reducers: {
    // Add any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneStudentFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fee = action.payload.data || null;
      })
      .addCase(fetchOneStudentFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Create student fee
    builder
      .addCase(createStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentFee.fulfilled, (state, action) => {
        state.loading = false;
        //state.fees.push(action.payload.data);
      })
      .addCase(createStudentFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Update student fee
    builder
      .addCase(updateStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentFee.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateStudentFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Delete student fees
    builder
      .addCase(deleteStudentFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentFees.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteStudentFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default studentFeesSlice.reducer;
