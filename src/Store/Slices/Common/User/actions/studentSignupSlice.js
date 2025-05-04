// src/Store/Slices/Common/User/actions/studentSignupSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loadDraft,
  saveDraft,
  clearDraft,
} from "../../../../../Utils/signupDraft";
import { toast } from "react-hot-toast";
import {
  customRequest,
  getData,
  postData,
} from "../../../../../services/apiEndpoints";
import { setShowError } from "../../Alerts/alertsSlice";
import { handleError } from "../../Alerts/errorhandling.action";
import { getUserRole } from "../../../../../Utils/getRoles";

/* ------------------------------------------------------------------ */
/* 1️⃣  Thunks ────────────────────────────────────────────────────── */
/* ------------------------------------------------------------------ */

// Send OTP to student email
export const sendStudentOtp = createAsyncThunk(
  "studentSignup/sendOtp",
  async ({ email, schoolId }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await postData("/student/send_otp", {
        email,
        schoolId,
      });
      toast.success("OTP sent successfully");
      return response;
    } catch (error) {
      toast.error("Failed to send OTP");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Verify student OTP
export const verifyStudentOtp = createAsyncThunk(
  "studentSignup/verifyOtp",
  async ({ email, schoolId, otp }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await postData("/student/verify_otp", {
        email,
        schoolId,
        otp,
      });
      toast.success("OTP verified successfully");
      return response;
    } catch (error) {
      toast.error("Invalid OTP");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Check if student exists by email
export const checkStudentByEmail = createAsyncThunk(
  "studentSignup/checkStudent",
  async (email, { rejectWithValue, dispatch }) => {
    try {
      const response = await getData(
        `/student/register/student?email=${email}`
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const registerStudentDetails = createAsyncThunk(
  "auth/registerStudentDetails",
  async ({ formData, navigate }, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get the user role; default to 'student' if not authenticated
      const role = getUserRole(getState) || "student";
      const endpoint = `/${role}/student_register`;

      const response = await customRequest("put", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

      if (response?.success) {
        // toast.success("Registered Successfully");
        // navigate("/verify_students");
        return response;
      } else {
        return rejectWithValue(
          response?.msg || "Failed to save student details."
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
/* ------------------------------------------------------------------ */
/* 2️⃣  Initial‑state ─────────────── hydrate from localStorage draft  */
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
  isOtpLoading: false,
  isVerifying: false,
  isCheckingStudent: false,
  isRegistering: false,
  isUploading: false,
  error: null,
  otpError: null,
  verificationError: null,
  registrationError: null,
  uploadError: null,
  studentExists: false,
  registrationSuccess: false,
  uploadSuccess: false,
  isEmailVerified: false,
  verifiedEmail: null,
};

/* ------------------------------------------------------------------ */
/* 3️⃣ Slice definition                                                */
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
    clearOtpState(state) {
      state.otpError = null;
      state.verificationError = null;
    },
    clearRegistrationState(state) {
      state.registrationError = null;
      state.registrationSuccess = false;
    },
    clearUploadState(state) {
      state.uploadError = null;
      state.uploadSuccess = false;
    },
    setEmailVerified(state, { payload }) {
      state.isEmailVerified = true;
      state.verifiedEmail = payload;
    },
    clearVerification(state) {
      state.isEmailVerified = false;
      state.verifiedEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* OTP sending */
      .addCase(sendStudentOtp.pending, (state) => {
        state.isOtpLoading = true;
        state.otpError = null;
      })
      .addCase(sendStudentOtp.fulfilled, (state) => {
        state.isOtpLoading = false;
        state.otpError = null;
      })
      .addCase(sendStudentOtp.rejected, (state, action) => {
        state.isOtpLoading = false;
        state.otpError = action.payload;
      })

      /* OTP verification */
      .addCase(verifyStudentOtp.pending, (state) => {
        state.isVerifying = true;
        state.verificationError = null;
      })
      .addCase(verifyStudentOtp.fulfilled, (state) => {
        state.isVerifying = false;
        state.verificationError = null;
      })
      .addCase(verifyStudentOtp.rejected, (state, action) => {
        state.isVerifying = false;
        state.verificationError = action.payload;
      })

      /* Student check */
      .addCase(checkStudentByEmail.pending, (state) => {
        state.isCheckingStudent = true;
        state.studentExists = false;
      })
      .addCase(checkStudentByEmail.fulfilled, (state, action) => {
        state.isCheckingStudent = false;
      })
      .addCase(checkStudentByEmail.rejected, (state) => {
        state.isCheckingStudent = false;
        state.studentExists = false;
      })

      /* Student registration */
      .addCase(registerStudentDetails.pending, (state) => {
        state.isRegistering = true;
        state.registrationError = null;
        state.registrationSuccess = false;
      })
      .addCase(registerStudentDetails.fulfilled, (state) => {
        state.isRegistering = false;
        state.registrationError = null;
        state.registrationSuccess = true;
      })
      .addCase(registerStudentDetails.rejected, (state, action) => {
        state.isRegistering = false;
        state.registrationError = action.payload;
        state.registrationSuccess = false;
      });
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  updateFormData,
  resetSignup,
  clearOtpState,
  clearRegistrationState,
  clearUploadState,
  clearVerification,
  setEmailVerified,
} = studentSignupSlice.actions;

export default studentSignupSlice.reducer;

/* ------------------------------------------------------------------ */
/* 4️⃣  Middleware – persist draft on every mutation                   */
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
