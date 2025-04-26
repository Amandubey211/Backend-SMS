import { createSlice } from "@reduxjs/toolkit";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle
} from "./vehicles.action";

const initialState = {
  loading: false,
  error: false,
  vehicles: [],
  selectedVehicle: null,
  currentPage: 1,
  totalPages: 1,
  totalVehicles: 0,
};

const transportvehicleSlice = createSlice({
  name: "transportVehicle",
  initialState,
  reducers: {
    resetSelectedVehicle(state) {
      state.selectedVehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get All Vehicles
      .addCase(getAllVehicles.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllVehicles.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload?.data || {};
        state.vehicles = response || [];
        state.currentPage = response.currentPage || 1;
        state.totalPages = response.totalPages || 1;
        state.totalVehicles = response.totalVehicles || 0;
      })
      .addCase(getAllVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Get Vehicle By Id
      .addCase(getVehicleById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicle = action.payload?.data || null;
      })
      .addCase(getVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Create Vehicle
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const newVehicle = action.payload?.data;
        if (newVehicle) {
          state.vehicles.push(newVehicle);
          state.totalVehicles += 1; // New vehicle added, so increase total
        }
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Update Vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVehicle = action.payload?.data;
        const index = state.vehicles.findIndex(v => v._id === updatedVehicle._id);
        if (index !== -1) {
          state.vehicles[index] = updatedVehicle;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Delete Vehicle
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg; // thunk में भेजा गया vehicleId
        state.vehicles = state.vehicles.filter(v => v._id !== deletedId);
        state.totalVehicles -= 1; // Deleted, so decrease total
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { resetSelectedVehicle } = transportvehicleSlice.actions;
export default transportvehicleSlice.reducer;
