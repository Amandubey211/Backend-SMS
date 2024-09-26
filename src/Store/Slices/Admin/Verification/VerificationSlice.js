// src/Store/Slices/Admin/Verification/verificationSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  verifyStudent,
  assignClassToStudent,
  fetchUnverifiedStudents,
  fetchRejectedStudents,
} from "./VerificationThunks";

const initialState = {
  unVerifiedStudents: [],
  rejectedStudents: [],
  loadingUnverified: false,
  loadingRejected: false,
  error: null,
  activeTab: "unverified",
  searchQuery: "",
  lastFetchedUnverified: null,
  lastFetchedRejected: null,
};

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Unverified Students
      .addCase(fetchUnverifiedStudents.pending, (state) => {
        state.loadingUnverified = true;
        state.error = null;
      })
      .addCase(fetchUnverifiedStudents.fulfilled, (state, action) => {
        state.loadingUnverified = false;
        state.unVerifiedStudents = action.payload;
        state.lastFetchedUnverified = Date.now();
      })
      .addCase(fetchUnverifiedStudents.rejected, (state, action) => {
        state.loadingUnverified = false;
        state.error = action.payload;
        state.unVerifiedStudents = []; // Ensure no loop on empty data
      })
      // Fetch Rejected Students
      .addCase(fetchRejectedStudents.pending, (state) => {
        state.loadingRejected = true;
        state.error = null;
      })
      .addCase(fetchRejectedStudents.fulfilled, (state, action) => {
        state.loadingRejected = false;
        state.rejectedStudents = action.payload;
        state.lastFetchedRejected = Date.now();
      })
      .addCase(fetchRejectedStudents.rejected, (state, action) => {
        state.loadingRejected = false;
        state.error = action.payload;
        state.rejectedStudents = []; // Ensure no loop on empty data
      })
      // Verify Student
      .addCase(verifyStudent.pending, (state) => {
        state.loadingUnverified = true;
        state.error = null;
      })
      .addCase(verifyStudent.fulfilled, (state, action) => {
        state.loadingUnverified = false;
        // const updatedStudent = action.payload;
        // state.unVerifiedStudents = state.unVerifiedStudents.filter(
        //   (student) => student._id !== updatedStudent._id
        // );
      })
      .addCase(verifyStudent.rejected, (state, action) => {
        state.loadingUnverified = false;
        state.error = action.payload;
      })
      // Assign Class to Student
      .addCase(assignClassToStudent.pending, (state) => {
        state.loadingUnverified = true;
        state.error = null;
      })
      .addCase(assignClassToStudent.fulfilled, (state) => {
        state.loadingUnverified = false;
      })
      .addCase(assignClassToStudent.rejected, (state, action) => {
        state.loadingUnverified = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setActiveTab, setSearchQuery } =
  verificationSlice.actions;
export default verificationSlice.reducer;
