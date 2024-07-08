import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isLoggedIn: false,
    step: 1,
    role: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setAuth, setRole, setStep } = AuthSlice.actions;

export default AuthSlice.reducer;
