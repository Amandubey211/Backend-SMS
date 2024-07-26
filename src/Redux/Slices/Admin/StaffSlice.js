import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allStaff: [],
  allAccountant: [],
  allLibrarian: [],
};

const StaffSlice = createSlice({
  name: 'Staff',
  initialState,
  reducers: {
    setStaff: (state, action) => {
      state.allStaff = action.payload.staff;
      state.allAccountant = action.payload.accountant;
      state.allLibrarian = action.payload.librarian;
    },
  },
});

export const { setStaff } = StaffSlice.actions;

export default StaffSlice.reducer;
