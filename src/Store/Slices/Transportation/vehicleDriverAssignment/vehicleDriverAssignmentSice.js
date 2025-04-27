import { createSlice } from "@reduxjs/toolkit";
import { createOrUpdateDriverVehicleAssignment, getDriverVehicleAssignments } from "./vehicleDriverAssignment.action";


const initialState = {
  loading: false,
  error: false,
  assignments: [],
  currentPage: 1,
  totalPages: 1,
  selectedAssignment: null,
};

const driverVehicleAssignmentSlice = createSlice({
  name: "driverVehicleAssignment",
  initialState,
  reducers: {
    resetSelectedAssignment(state) {
      state.selectedAssignment = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get All Assignments
      .addCase(getDriverVehicleAssignments.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getDriverVehicleAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload?.data?.assignments || [];
        state.currentPage = action.payload?.currentPage || 1;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getDriverVehicleAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Create or Update Assignment
      .addCase(createOrUpdateDriverVehicleAssignment.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createOrUpdateDriverVehicleAssignment.fulfilled, (state, action) => {
        state.loading = false;
        
      })
      .addCase(createOrUpdateDriverVehicleAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { resetSelectedAssignment } = driverVehicleAssignmentSlice.actions;
export default driverVehicleAssignmentSlice.reducer;
