import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isLogedIn: false,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isLogedIn = action.payload;
    },
  },
});

export const { setAuth } = AuthSlice.actions;

export default AuthSlice.reducer;
