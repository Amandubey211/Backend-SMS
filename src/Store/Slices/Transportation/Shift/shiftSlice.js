import { createSlice } from "@reduxjs/toolkit";
import { createShift, deleteShift, getAllShifts, getShiftById, toggleShiftStatus, updateShift } from "./shift.action";


const initialState = {
  loading: false,
  error: false,
  shifts: [],
  selectedShift: null,
  currentPage: 1,
  totalPages: 1,
  totalShifts: 0,
};

const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    resetSelectedShift(state) {
      state.selectedShift = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Shifts
      .addCase(getAllShifts.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload?.data || [];
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
        state.totalShifts = action.payload?.data?.totalShifts || 0;
      })
      .addCase(getAllShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Get Shift By ID
      .addCase(getShiftById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload?.data || null;
      })
      .addCase(getShiftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Create Shift
      .addCase(createShift.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.loading = false;
        // state.shifts.push(action.payload?.data);
      })
      .addCase(createShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Update Shift
      .addCase(updateShift.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        state.loading = false;
        // const updatedShift = action.payload?.data;
        // const index = state.shifts.findIndex(shift => shift._id === updatedShift._id);
        // if (index !== -1) {
        //   state.shifts[index] = updatedShift;
        // }
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Toggle Shift Status
      .addCase(toggleShiftStatus.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(toggleShiftStatus.fulfilled, (state, action) => {
        state.loading = false;
        // const updatedShift = action.payload?.data;
        // const index = state.shifts.findIndex(shift => shift._id === updatedShift._id);
        // if (index !== -1) {
        //   state.shifts[index].isActive = updatedShift.isActive; 
        // }
      })
      .addCase(toggleShiftStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Delete Shift
      .addCase(deleteShift.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg; 
        state.shifts = state.shifts.filter(shift => shift._id !== deletedId);
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { resetSelectedShift } = shiftSlice.actions;
export default shiftSlice.reducer;
