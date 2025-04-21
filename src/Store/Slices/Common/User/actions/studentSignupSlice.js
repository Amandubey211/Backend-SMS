// src/Store/Slices/Common/User/actions/studentSignupSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  registerStudentDetails,
  uploadStudentDocuments,
} from "../../Auth/actions/studentActions";
import {
  loadDraft,
  saveDraft,
  clearDraft,
} from "../../../../../Utils/signupDraft";

/* ------------------------------------------------------------------ */
/* 1️⃣  Initial‑state ─────────────── hydrate from localStorage draft  */
/* ------------------------------------------------------------------ */
const draft = loadDraft();

const baseForm = {
  school: {},
  guardian: {},
  candidate: {},
  academic: {},
  address: {},
  documents: [],
  consent: {},
};

const initialState = {
  currentStep: draft?.currentStep ?? 0,
  formData: { ...baseForm, ...(draft?.formData || {}) },
  isLoading: false,
  error: null,
};

/* ------------------------------------------------------------------ */
/* 2️⃣ Slice definition                                                */
/* ------------------------------------------------------------------ */
const studentSignupSlice = createSlice({
  name: "studentSignup",
  initialState,
  reducers: {
    setCurrentStep(state, { payload }) {
      state.currentStep = payload;
    },
    nextStep(state) {
      if (state.currentStep < 6) state.currentStep += 1;
    },
    prevStep(state) {
      if (state.currentStep > 0) state.currentStep -= 1;
    },
    updateFormData(state, { payload }) {
      state.formData = { ...state.formData, ...payload };
    },
    resetSignup() {
      /* clear LS draft and return *fresh* state */
      clearDraft();
      return { ...initialState, currentStep: 0, formData: { ...baseForm } };
    },
  },
  extraReducers: (builder) => {
    /* shared flags */
    const pending = (s) => {
      s.isLoading = true;
      s.error = null;
    };
    const rejected = (s, a) => {
      s.isLoading = false;
      s.error = a.payload ?? "Something went wrong";
    };

    builder
      /* register */
      .addCase(registerStudentDetails.pending, pending)
      .addCase(registerStudentDetails.rejected, rejected)
      /* upload */
      .addCase(uploadStudentDocuments.pending, pending)
      .addCase(uploadStudentDocuments.rejected, rejected)
      /* fulfilled for either thunk */
      .addMatcher(
        (a) =>
          [
            registerStudentDetails.fulfilled.type,
            uploadStudentDocuments.fulfilled.type,
          ].includes(a.type),
        (s) => {
          s.isLoading = false;
          s.error = null;
        }
      );
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  updateFormData,
  resetSignup,
} = studentSignupSlice.actions;

export default studentSignupSlice.reducer;

/* ------------------------------------------------------------------ */
/* 3️⃣  Middleware – persist draft on every mutation                   */
/* ------------------------------------------------------------------ */
export const studentSignupMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  /* save only when this slice changes */
  if (action.type.startsWith("studentSignup/")) {
    const { currentStep, formData } = store.getState().common.studentSignup;
    saveDraft({ currentStep, formData });
  }

  return result;
};
