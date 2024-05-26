import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isLogedIn: false,
    step: 1,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isLogedIn = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
  },
});

export const { setAuth, setStep } = AuthSlice.actions;

export default AuthSlice.reducer;
