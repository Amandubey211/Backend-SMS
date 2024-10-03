import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStaff } from "./staff.action";
const initialState = {
    accountant:[],
    staff:[],
    librarian:[],
    error:null,
    loading:false,
}
const allStaffSlice = createSlice({
    name: "allStaff",
    initialState,
    reducers: {
      setAllStaffs(state, action) {
        state.accountant = action.payload.accountant;
        state.staff = action.payload.staff;
        state.librarian = action.payload.librarian;
      },
      clearError(state) {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch All Students
        .addCase(fetchAllStaff.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllStaff.fulfilled, (state, action) => {
          state.accountant = action.payload.accountant;
          state.staff = action.payload.staff;
          state.librarian = action.payload.librarian;
          state.loading = false;
          state.error = null;
        })
        .addCase(fetchAllStaff.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { setAllStaffs, clearError } = allStaffSlice.actions;
  export default allStaffSlice.reducer;
  