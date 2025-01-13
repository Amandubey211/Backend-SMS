// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStudentFees,
  fetchOneStudentFee,
  createStudentFee,
  updateStudentFee,
  deleteStudentFees,
  studentFeesGraph,
  fetchStudentFeeCardData,
  createStudentFeeRecordForClass,
} from "./studentFeesThunks";

const initialState = {
  fees: [],
  fee: null,
  loading: false,
  error: null,
  stdFeesGraph: [],
  stdFeesCardData:{}
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
      //for class
    builder
      .addCase(createStudentFeeRecordForClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentFeeRecordForClass.fulfilled, (state, action) => {
        state.loading = false;
        //state.fees.push(action.payload.data);
      })
      .addCase(createStudentFeeRecordForClass.rejected, (state, action) => {
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

    //student fees graph
    builder
      .addCase(studentFeesGraph.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studentFeesGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.stdFeesGraph = action.payload?.data;
      })
      .addCase(studentFeesGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });

    //student fees card data
    builder
      .addCase(fetchStudentFeeCardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFeeCardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stdFeesCardData = action.payload;
      })
      .addCase(fetchStudentFeeCardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export default studentFeesSlice.reducer;
