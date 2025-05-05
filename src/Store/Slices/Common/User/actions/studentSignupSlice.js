import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import {
  postData,
  getData,
  putData,
  customRequest,
} from "../../../../../services/apiEndpoints";
import { setShowError } from "../../Alerts/alertsSlice";
import { handleError } from "../../Alerts/errorhandling.action";
import { getUserRole } from "../../../../../Utils/getRoles";

/* ------------------------------------------------------------------ */
/* 🔸  THUNKS                                                          */
/* ------------------------------------------------------------------ */
/* ––––– helpers ––––– */
const cacheKey = "signupStep1";
const loadCache = () => JSON.parse(sessionStorage.getItem(cacheKey) || "{}");

/* ---------- OTP ---------- */
export const sendStudentOtp = createAsyncThunk(
  "studentSignup/sendOtp",
  async ({ email, schoolId }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const res = await postData("/student/send_otp", { email, schoolId });
      toast.success("OTP sent");
      return res;
    } catch (err) {
      toast.error("Failed to send OTP");
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

export const verifyStudentOtp = createAsyncThunk(
  "studentSignup/verifyOtp",
  async ({ email, schoolId, otp }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const res = await postData("/student/verify_otp", {
        email,
        schoolId,
        otp,
      });
      toast.success("OTP verified");
      return res;
    } catch (err) {
      toast.error("Invalid OTP");
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* ---------- draft helpers ---------- */
export const fetchStudentDraft = createAsyncThunk(
  "studentSignup/fetchDraft",
  async ({ email }, { rejectWithValue, dispatch }) => {
    try {
      const res = await getData(`/student/register/student?email=${email}`);
      return res; // { success, exists, data }
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

export const saveStudentDraft = createAsyncThunk(
  "studentSignup/saveDraft",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { formData } = getState().common.studentSignup;

      const email = (formData.candidate?.email || "").toLowerCase();
      const schoolId = formData.school?.schoolId;

      /* no step‑1 → nothing to save yet */
      if (!email || !schoolId) return true;

      await putData("/student/register/student?formStatus=draft", {
        ...formData,
        candidate: { ...formData.candidate, email },
      });
      return true;
    } catch {
      return rejectWithValue("draft‑save‑failed");
    }
  }
);

/* ---------- final submit ---------- */
export const registerStudentDetails = createAsyncThunk(
  "studentSignup/register",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { formData } = getState().common.studentSignup;
      const role = getUserRole(getState) || "student";
      const endpoint = `/${role}/student_register?formStatus=submitted`;

      const fd = new FormData();
      fd.append("json", JSON.stringify(formData));
      formData.documents?.forEach((file) => fd.append("documents", file));

      const res = await customRequest("put", endpoint, fd, {
        "Content-Type": "multipart/form-data",
      });
      toast.success("Application submitted");
      return res;
    } catch (err) {
      toast.error("Submit failed");
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* ------------------------------------------------------------------ */
/* 🔸  STATE SHAPE                                                     */
/* ------------------------------------------------------------------ */

const baseForm = {
  school: loadCache(),
  guardian: {},
  candidate: {},
  academic: {},
  address: {},
  documents: [],
  consent: {},
};

const initialState = {
  currentStep: 0,
  formData: baseForm,

  /* flags */
  isOtpLoading: false,
  otpError: null,
  isVerifying: false,
  verificationError: null,

  isRegistering: false,
  isEmailVerified: loadCache().isVerified || false,
  verifiedEmail: loadCache().isVerified ? loadCache().email : null,
};

/* helper – grab cached step‑1 from sessionStorage */
const loadStep1Cache = () => {
  try {
    return JSON.parse(sessionStorage.getItem("step1Cache") || "{}");
  } catch {
    return {};
  }
};

/* helper – map Mongo draft → wizard sections */
const mapDraftToSections = (doc) => ({
  /* STEP‑1 remains exactly as user/cache already has */
  guardian: doc.guardian ?? {},
  candidate: {
    firstName: doc.firstName,
    lastName: doc.lastName,
    dob: doc.dateOfBirth,
    gender: doc.gender,
    contactNumber: doc.contactNumber,
    email: doc.email,
  },
  academic: doc.academicHistory ?? {},
  address: doc.permanentAddress ?? {},
  documents: Object.entries(doc.attachments?.mandatory || {}).map(
    ([name, url]) => ({ name, url, mandatory: true })
  ),
  // consent left empty
});

/* ------------------------------------------------------------------ */
/* 🔸  SLICE                                                           */
/* ------------------------------------------------------------------ */

const studentSignupSlice = createSlice({
  name: "studentSignup",
  initialState,
  reducers: {
    setCurrentStep: (s, a) => {
      s.currentStep = a.payload;
    },
    nextStep: (s) => {
      if (s.currentStep < 6) s.currentStep += 1;
    },
    prevStep: (s) => {
      if (s.currentStep > 0) s.currentStep -= 1;
    },
    updateFormData: (s, a) => {
      s.formData = { ...s.formData, ...a.payload };
    },
    resetSignup: () => initialState,

    /* email verification flags */
    setEmailVerified: (s, a) => {
      s.isEmailVerified = true;
      s.verifiedEmail = a.payload;
      /* also annotate formData.school.isVerified so Yup passes */
      s.formData.school = {
        ...s.formData.school,
        isVerified: true,
      };
    },
    clearOtpState: (s) => {
      s.otpError = null;
    },
    clearVerification: (s) => {
      s.isEmailVerified = false;
      s.verifiedEmail = null;
      s.formData.school = { ...s.formData.school, isVerified: false };
    },
  },

  extraReducers: (builder) => {
    /* ---------- OTP send ---------- */
    builder
      .addCase(sendStudentOtp.pending, (s) => {
        s.isOtpLoading = true;
        s.otpError = null;
      })
      .addCase(sendStudentOtp.fulfilled, (s) => {
        s.isOtpLoading = false;
      })
      .addCase(sendStudentOtp.rejected, (s, a) => {
        s.isOtpLoading = false;
        s.otpError = a.payload;
      });

    /* ---------- OTP verify ---------- */
    builder
      .addCase(verifyStudentOtp.pending, (s) => {
        s.isVerifying = true;
        s.verificationError = null;
      })
      .addCase(verifyStudentOtp.fulfilled, (s) => {
        s.isVerifying = false;
      })
      .addCase(verifyStudentOtp.rejected, (s, a) => {
        s.isVerifying = false;
        s.verificationError = a.payload;
      });

    /* ---------- fetch draft ---------- */
    builder.addCase(fetchStudentDraft.fulfilled, (s, a) => {
      if (a.payload?.success && a.payload.exists) {
        /* only merge non‑step‑1 sections */
        s.formData = { ...s.formData, ...mapDraftToSections(a.payload.data) };
      }
    });

    /* ---------- save draft (no ui‑state change) ---------- */

    /* ---------- final submit ---------- */
    builder
      .addCase(registerStudentDetails.pending, (s) => {
        s.isRegistering = true;
      })
      .addCase(registerStudentDetails.fulfilled, (s) => {
        s.isRegistering = false;
      })
      .addCase(registerStudentDetails.rejected, (s) => {
        s.isRegistering = false;
      });
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  updateFormData,
  resetSignup,
  setEmailVerified,
  clearOtpState,
  clearVerification,
} = studentSignupSlice.actions;

export default studentSignupSlice.reducer;
