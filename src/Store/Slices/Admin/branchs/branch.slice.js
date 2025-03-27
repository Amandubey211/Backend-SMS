import { createSlice } from "@reduxjs/toolkit";
import { fetchBranch, updateBranch, updateBranchInfo } from "./branch.action";

const initialState = {
  branchs: [],
  loading: false,
  error: null,
};

const branchSlice = createSlice({
  name: "academicYear",
  initialState,
  extraReducers: (builder) => {
    builder
      // FETCH BRANCH
      .addCase(fetchBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branchs = action.payload;
        state.error = null;
      })
      .addCase(fetchBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // UPDATE BRANCH
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can update the state here if needed.
        // e.g., state.branchs = ...some logic...
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // UPDATE BRANCH INFO
      .addCase(updateBranchInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranchInfo.fulfilled, (state, action) => {
        state.loading = false;
        // Since updateBranchInfo dispatches fetchBranch again,
        // the branch list should be refreshed. No extra logic needed here.
      })
      .addCase(updateBranchInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export default branchSlice.reducer;
