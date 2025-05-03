import { createSlice } from "@reduxjs/toolkit";
import { assignPersonToVehicle, fetchPersonsAssignedStatus } from "./vehiclePersonAssignmnet.action";

const initialState = {
  assignedUsers: [],
//   assignmentResult: null,
  loading: false,
  error: null,
};

const vehiclePersonAssignmentSlice = createSlice({
  name: "transportation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --- FETCH ASSIGNED STATUS ---
      .addCase(fetchPersonsAssignedStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonsAssignedStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedUsers = action.payload;
      })
      .addCase(fetchPersonsAssignedStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- ASSIGN PERSON TO VEHICLE ---
      .addCase(assignPersonToVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignPersonToVehicle.fulfilled, (state, action) => {
        state.loading = false;
        // state.assignmentResult = action.payload;
      })
      .addCase(assignPersonToVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = vehiclePersonAssignmentSlice.actions;

export default vehiclePersonAssignmentSlice.reducer;
