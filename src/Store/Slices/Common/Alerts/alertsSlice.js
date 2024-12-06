import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showError: false,
  errorMsg: "",
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setShowError: (state, action) => {
      state.showError = action.payload;
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload;
    },
  },
});

export const { setShowError, setErrorMsg } = alertsSlice.actions;
export default alertsSlice.reducer;
