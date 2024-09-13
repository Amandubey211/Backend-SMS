import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isLoggedIn: false,
    step: 1,
    role: null,
    AcademicYear: {},
    // isAcademicYearActive:null,
    userDetail: {},
    selectedLanguage: "EN",
  },
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setAcademicYear: (state, action) => {
      state.AcademicYear = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUerDetails: (state, action) => {
      state.userDetail = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
  },
});

export const {
  setAuth,
  setRole,
  setStep,
  setUerDetails,
  setAcademicYear,
  setSelectedLanguage,
} = AuthSlice.actions;

export default AuthSlice.reducer;
