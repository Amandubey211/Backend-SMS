import { createSlice } from "@reduxjs/toolkit";

const AdminSlice = createSlice({
  name: "Admin",
  initialState: {
    unVerifiedStudents: [],
    classList: [],
  },
  reducers: {
    setUnVerifiedStudents: (state, action) => {
      state.unVerifiedStudents = action.payload;
    },
    setClassList: (state, action) => {
      state.classList = action.payload;
    },
  },
});

export const { setUnVerifiedStudents, setClassList } = AdminSlice.actions;

export default AdminSlice.reducer;
