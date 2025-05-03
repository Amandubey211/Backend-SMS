// helperSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchHelperList, addHelper, updateHelper, deleteHelper } from "./helper.action";

const helperSlice = createSlice({
  name: "helper",
  initialState: {
    helpers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch helpers
      .addCase(fetchHelperList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHelperList.fulfilled, (state, action) => {
        state.loading = false;
        state.helpers = action.payload?.data || [];
      })
      .addCase(fetchHelperList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch helpers";
      })

      // Add helper
      .addCase(addHelper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHelper.fulfilled, (state, action) => {
        state.loading = false;
        // state.helpers.push(action.payload?.data); // Again, adjust based on your API response
      })
      .addCase(addHelper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add helper";
      })

      // Update helper
      .addCase(updateHelper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHelper.fulfilled, (state, action) => {
        state.loading = false;
        // const updatedhelper = action.payload?.data;
        // const index = state.helpers.findIndex(helper => helper._id === updatedhelper._id);
        // if (index !== -1) {
        //   state.helpers[index] = updatedhelper;
        // }
      })
      .addCase(updateHelper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update helper";
      })

      // Delete helper
      .addCase(deleteHelper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHelper.fulfilled, (state, action) => {
        state.loading = false;
        // const deletedId = action.meta.arg; // since thunk arg is id
        // state.helpers = state.helpers.filter(helper => helper._id !== deletedId);
      })
      .addCase(deleteHelper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete helper";
      });
  },
});

export default helperSlice.reducer;
