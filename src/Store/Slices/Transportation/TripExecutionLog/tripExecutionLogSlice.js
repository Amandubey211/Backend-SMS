import { createSlice } from "@reduxjs/toolkit";
import {
  createTripLog,
  endTripLog,
  getAllTripLogs,
  getTripLogsByVehicle,
  startTripLog,
  toggleGPS
} from "./tripExecutionLog.action";

  const initialState = {
    loading: false,
    error: null,
    trip: null,
    isGpsOn:false,
    currentLocation:null,
    tripLogs: [],
    vehicleWiseLogs: [],
    pagination: {
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
      limit: 10,
      type: "today",
    },
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
    setIsGpsOn:(state,action)=>{
      state.isGpsOn=action.payload;
    },
    setCurrentLocation:(state,action)=>{
      state.currentLocation=action.payload;
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
        state.vehicleWiseLogs = action.payload?.data;
        state.pagination = action.payload?.pagination;
      })
      .addCase(getTripLogsByVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Toggle-Gps
      .addCase(toggleGPS.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleGPS.fulfilled, (state, action) => {
        state.loading = false;
        state.gpsStatus = action.payload?.trip?.isGPSOn; 

      })
      .addCase(toggleGPS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearTripData,setIsGpsOn,setCurrentLocation } = tripExecutionLogSlice.actions;

export default tripExecutionLogSlice.reducer;
