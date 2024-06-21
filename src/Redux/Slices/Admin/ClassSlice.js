import { createSlice } from "@reduxjs/toolkit";

const ClassSlice = createSlice({
  name: "class",
  initialState: {
    class: {},
  },
  reducers: {
    setClass: (state, action) => {
      state.class = action.payload;
    },
  },
});

export const { setClass } = ClassSlice.actions;

export default ClassSlice.reducer;
