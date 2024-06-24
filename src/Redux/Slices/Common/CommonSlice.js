import { createSlice } from "@reduxjs/toolkit";

const CommonSlice = createSlice({
  name: "Common",
  initialState: {
    selectedClass: null,
    selectedSubject: null,
    NavbarData: {
      leftHeading: ["aman"],
    },
  },
  reducers: {
    setLeftHeading: (state, action) => {
      state.NavbarData.leftHeading = action.payload;
    },
    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload;
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
  },
});

export const { setLeftHeading, setSelectedSubject, setSelectedClass } =
  CommonSlice.actions;

export default CommonSlice.reducer;
