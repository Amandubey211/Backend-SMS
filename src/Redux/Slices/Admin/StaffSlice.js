import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allStaff: [],
  allAccountant: [],
  allLibraian: [],
};

const StaffSlice = createSlice({
  name: 'Staff',
  initialState,
  reducers: {
    setStaff: (state, action) => {
      state.allStaff = action.payload.staff;
      state.allAccountant = action.payload.accountant;
      state.allLibraian = action.payload.libraian;
    },
  },
});

export const { setStaff } = StaffSlice.actions;

export default StaffSlice.reducer;
