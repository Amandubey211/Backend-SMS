// driverSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchDriverList, addDriver, updateDriver, deleteDriver } from "./driver.action";

const driverSlice = createSlice({
  name: "driver",
  initialState: {
    drivers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Drivers
      .addCase(fetchDriverList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverList.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload?.data || [];
      })
      .addCase(fetchDriverList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch drivers";
      })

      // Add Driver
      .addCase(addDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDriver.fulfilled, (state, action) => {
        state.loading = false;
        // state.drivers.push(action.payload?.data); // Again, adjust based on your API response
      })
      .addCase(addDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add driver";
      })

      // Update Driver
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        // const updatedDriver = action.payload?.data;
        // const index = state.drivers.findIndex(driver => driver._id === updatedDriver._id);
        // if (index !== -1) {
        //   state.drivers[index] = updatedDriver;
        // }
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update driver";
      })

      // Delete Driver
      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.loading = false;
        // const deletedId = action.meta.arg; // since thunk arg is id
        // state.drivers = state.drivers.filter(driver => driver._id !== deletedId);
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete driver";
      });
  },
});

export default driverSlice.reducer;
