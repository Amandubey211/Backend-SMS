import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isLoggedIn: false,
    step: 1,
    role: null,
    userDetail: {},
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
    setUerDetails: (state, action) => {
      state.userDetail = action.payload;
    },
  },
});

export const { setAuth, setRole, setStep, setUerDetails } = AuthSlice.actions;

export default AuthSlice.reducer;
