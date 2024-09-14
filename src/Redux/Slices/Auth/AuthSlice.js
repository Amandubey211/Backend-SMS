import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isLoggedIn: false,
    step: 1,
    role: null,
    AcademicYear: [], // Changed to array for multiple years
    userDetail: {},
    selectedLanguage: "en",
  },
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setAcademicYear: (state, action) => {
      // Assuming action.payload contains an array of academic years
      state.AcademicYear = action.payload;
    },
    setActiveAcademicYear: (state, action) => {
      // Action payload contains the ID of the year to set active
      state.AcademicYear = state.AcademicYear.map((year) => ({
        ...year,
        isActive: year.id === action.payload, // Set active based on the ID
      }));
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUserDetails: (state, action) => {
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
  setAcademicYear,
  setActiveAcademicYear, // Added reducer for setting active year
  setUserDetails, // Fixed typo
  setSelectedLanguage,
} = AuthSlice.actions;

export default AuthSlice.reducer;
