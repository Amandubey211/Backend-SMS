import { createSlice } from "@reduxjs/toolkit";

const CommonSlice = createSlice({
  name: "Common",
  initialState: {
    NavbarData: {
      leftHeading: ["Students"],
    },
  },
  reducers: {
    setLeftHeading: (state, action) => {
      state.NavbarData.leftHeading = action.payload;
    },
  },
});

export const { setLeftHeading } = CommonSlice.actions;

export default CommonSlice.reducer;
