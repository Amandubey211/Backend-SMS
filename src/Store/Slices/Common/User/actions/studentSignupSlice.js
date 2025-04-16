// studentSignupSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 0,
  formData: {
    school: {},
    guardian: {},
    candidate: {},
    academic: {},
    address: {},
    documents: [],
    consent: {},
  },
  isLoading: false,
  error: null,
};

const studentSignupSlice = createSlice({
  name: "studentSignup",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 6) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    updateFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    resetSignup: () => initialState,
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  updateFormData,
  resetSignup,
  setLoading,
  setError,
} = studentSignupSlice.actions;

export default studentSignupSlice.reducer;
