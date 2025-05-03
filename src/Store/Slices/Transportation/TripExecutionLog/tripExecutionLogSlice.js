import { createSlice } from "@reduxjs/toolkit";
import { createTripLog, endTripLog, getAllTripLogs, getTripLogsByVehicle, startTripLog } from "./tripExecutionLog.action";




const initialState = {
  loading: false,
  error: null,
  trip: null,
  tripLogs: [],
  vehicleWiseLogs: [],
};

const tripExecutionLogSlice = createSlice({
  name: "tripExecutionLog",
  initialState,
  reducers: {
    clearTripData: (state) => {
      state.trip = null;
      state.tripLogs = [];
      state.vehicleWiseLogs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Trip Log
      .addCase(createTripLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTripLog.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(createTripLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Start Trip
      .addCase(startTripLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(startTripLog.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload.trip;
      })
      .addCase(startTripLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // End Trip
      .addCase(endTripLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(endTripLog.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload.trip;
      })
      .addCase(endTripLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Logs
      .addCase(getAllTripLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTripLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.tripLogs = action.payload;
      })
      .addCase(getAllTripLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Logs by Vehicle
      .addCase(getTripLogsByVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTripLogsByVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleWiseLogs = action.payload;
      })
      .addCase(getTripLogsByVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTripData } = tripExecutionLogSlice.actions;

export default tripExecutionLogSlice.reducer;
