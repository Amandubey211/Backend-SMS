// driverSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchHelperList, addHelper, updateHelper, deleteHelper } from "./helper.action";

const driverSlice = createSlice({
  name: "helper",
  initialState: {
    drivers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Drivers
      .addCase(fetchHelperList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHelperList.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload?.data || [];
      })
      .addCase(fetchHelperList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch drivers";
      })

      // Add Driver
      .addCase(addHelper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHelper.fulfilled, (state, action) => {
        state.loading = false;
        // state.drivers.push(action.payload?.data); // Again, adjust based on your API response
      })
      .addCase(addHelper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add driver";
      })

      // Update Driver
      .addCase(updateHelper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHelper.fulfilled, (state, action) => {
        state.loading = false;
        // const updatedDriver = action.payload?.data;
        // const index = state.drivers.findIndex(driver => driver._id === updatedDriver._id);
        // if (index !== -1) {
        //   state.drivers[index] = updatedDriver;
        // }
      })
      .addCase(updateHelper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update driver";
      })

      // Delete Driver
      .addCase(deleteHelper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHelper.fulfilled, (state, action) => {
        state.loading = false;
        // const deletedId = action.meta.arg; // since thunk arg is id
        // state.drivers = state.drivers.filter(driver => driver._id !== deletedId);
      })
      .addCase(deleteHelper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete driver";
      });
  },
});

export default driverSlice.reducer;
