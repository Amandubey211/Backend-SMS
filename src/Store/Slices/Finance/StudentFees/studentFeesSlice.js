// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllStudentFee,
  fetchOneStudentFee,
  createStudentFee,
  updateStudentFee,
  deleteStudentFees,
  studentFeesGraph,
  fetchStudentFeeCardData,
  createStudentFeeRecordForClass,
  fetchGraphStudentFee,
} from "./studentFeesThunks";

const initialState = {
  fees: [],
  allStudntFees: [],
  graphStudntFees: [],
  totalRecords:0,
  totalPages:1,
  currentPage: 1,
  paidAllAmount:0,
  totalAllAmount:0,
  studentsIdsArray:[],
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
    setSelectedStudentsIds: (state, action) => {
      state.studentsIdsArray = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneStudentFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fee = action.payload?.data || null;
      })
      .addCase(fetchOneStudentFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    builder
      .addCase(fetchGraphStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraphStudentFee.fulfilled, (state, action) => {
        state.loading = false;
        state.graphStudntFees = action.payload?.data || null;
      })
      .addCase(fetchGraphStudentFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    builder
      .addCase(fetchAllStudentFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudentFee.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudntFees = action.payload?.data || [];
        state.totalRecords= action.payload?.totalRecords;
        state.totalPages= action.payload?.totalPages;
        state.currentPage= action.payload?.currentPage;
        state.paidAllAmount= action.payload?.paidAllAmount;
        state.totalAllAmount = action.payload?.totalAllAmount;
       
      })
      .addCase(fetchAllStudentFee.rejected, (state, action) => {
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
export const { setSelectedStudentsIds } = studentFeesSlice.actions;
export default studentFeesSlice.reducer;
