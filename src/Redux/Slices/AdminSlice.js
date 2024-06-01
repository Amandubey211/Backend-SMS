import { createSlice } from "@reduxjs/toolkit";

const AdminSlice = createSlice({
  name: "Admin",
  initialState: {
    unVerifiedStudents: [],
    rejectedStudents: [],
    classList: [],
    NavbarData: {
      leftHeading: "Students",
    },
  },
  reducers: {
    setUnVerifiedStudents: (state, action) => {
      state.unVerifiedStudents = action.payload;
    },
    setRejectedStudents: (state, action) => {
      state.rejectedStudents = action.payload;
    },
    setClassList: (state, action) => {
      state.classList = action.payload;
    },
    setLeftHeading: (state, action) => {
      state.NavbarData.leftHeading = action.payload;
    },
  },
});

export const {
  setUnVerifiedStudents,
  setClassList,
  setLeftHeading,
  setRejectedStudents,
} = AdminSlice.actions;

export default AdminSlice.reducer;
