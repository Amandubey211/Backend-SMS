import { createSlice } from "@reduxjs/toolkit";

const ClassesSlice = createSlice({
  name: "classes",
  initialState: {
    allClass: [],
  },
  reducers: {
    setClasses: (state, action) => {
      state.allClass = action.payload;
    },
  },
});

export const { setClasses } = ClassesSlice.actions;

export default ClassesSlice.reducer;
