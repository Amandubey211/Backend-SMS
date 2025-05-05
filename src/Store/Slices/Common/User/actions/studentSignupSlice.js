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
import { stepSchemas } from "../../../../../Modules/LoginPages/Student/SignUp/Utils/validationSchemas";

/* ------------------------------------------------------------------ */
/* 🔸  THUNKS                                                          */
/* ------------------------------------------------------------------ */

/* helper – returns first incomplete step index */
const firstIncompleteStep = (data) => {
  for (let i = 0; i < stepSchemas.length; i += 1) {
    if (!stepSchemas[i].isValidSync(data, { strict: false })) return i;
  }
  return stepSchemas.length - 1; // everything valid → last step (Submit)
};
/* ––––– helpers ––––– */
const cacheKey = "signupStep1";
const loadCache = () => JSON.parse(sessionStorage.getItem(cacheKey) || "{}");
/* ---------- helper utilities ---------- */
const extractPhone = (contactObj) => contactObj?.value ?? "";
const extractIsWA = (contactObj) => !!contactObj?.isWhatsApp;

/** transforms mongo‑doc → { guardian, candidate, academic, address, documents } */
const mapDraftToSections = (doc) => {
  /* ----- father & mother (phones split into value + flag) ----- */
  const father = doc.fatherInfo || {};
  const mother = doc.motherInfo || {};

  const fatherSection = {
    ...father,
    cell1: extractPhone(father.cell1),
    cell1IsWhatsapp: extractIsWA(father.cell1),
    cell2: extractPhone(father.cell2),
    cell2IsWhatsapp: extractIsWA(father.cell2),
  };

  const motherSection = {
    ...mother,
    cell1: extractPhone(mother.cell1),
    cell1IsWhatsapp: extractIsWA(mother.cell1),
    cell2: extractPhone(mother.cell2),
    cell2IsWhatsapp: extractIsWA(mother.cell2),
  };

  /* ---------- build section payloads ---------- */
  return {
    /* STEP‑1 (school) – untouched, already in state/cache */

    /* Guardian tab (3‑in‑1) */
    guardian: {
      fatherInfo: fatherSection,
      motherInfo: motherSection,
      guardianInformation: {
        guardianName: doc.guardianName ?? "",
        guardianRelationToStudent: doc.guardianRelationToStudent ?? "",
        guardianContactNumber: doc.guardianContactNumber ?? "",
        guardianContactIsWhatsapp: false, // backend keeps plain string; adjust if you store flag
        guardianEmail: doc.guardianEmail ?? "",
      },
    },

    /* Candidate tab */
    candidate: {
      firstName: doc.firstName ?? "",
      lastName: doc.lastName ?? "",
      dob: doc.dateOfBirth ?? null,
      gender: doc.gender ?? "",
      contactNumber: doc.contactNumber ?? "",
      placeOfBirth: doc.placeOfBirth ?? "",
      religion: doc.religion ?? "",
      bloodGroup: doc.bloodGroup ?? "",
      email: doc.email, // verified already
    },

    /* Academic tab */
    academic: {
      ...doc.academicHistory, // previousSchoolName, previousClass, etc.
      // applyingClass: doc.applyingClass ?? "",
      // academicYear: doc.academicYear ?? "",
      sourceOfFee: doc.academicHistory?.sourceOfFee ?? "Parent",
    },

    /* Address tab */
    address: {
      permanentAddress: doc.permanentAddress ?? {},
      residentialAddress: doc.residentialAddress ?? {},
      transportRequired: doc.permanentAddress?.transportRequired ?? false,
    },

    /* Documents tab */
    documents: [
      ...Object.entries(doc.attachments?.mandatory || {}).map(
        ([name, url]) => ({
          name,
          url,
          mandatory: true,
        })
      ),
      ...Object.entries(doc.attachments?.optional || {}).map(([name, url]) => ({
        name,
        url,
        mandatory: false,
      })),
    ],

    /* Consent tab left empty – user fills it later */
  };
};

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
      if (res.success && res.exists) {
        return {
          ...res,
          data: {
            ...res.data,
            isVerified: true, // Mark as verified
          },
        };
      }
      return res; // { success, exists, data }
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

export const saveStudentDraft = createAsyncThunk(
  "studentSignup/saveDraft",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { formData } = getState().common.studentSignup;
      const email = (formData.candidate?.email || "").toLowerCase();
      const schoolId = formData.school?.schoolId;

      if (!email || !schoolId) return true;

      await putData("/student/register/student?formStatus=draft", {
        ...formData,
        candidate: { ...formData.candidate, email },
        currentStep: getState().common.studentSignup.currentStep,
      });

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "draft-save-failed"
      );
    }
  }
);

/* ---------- final submit ---------- */
export const registerStudentDetails = createAsyncThunk(
  "studentSignup/register",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { formData } = getState().common.studentSignup;
      // const role = getUserRole(getState) || "student";
      const endpoint = `/student/register/student?formStatus=submitted`;

      const fd = new FormData();

      // Ensure documents is properly structured
      const documents = formData.documents || {};
      const filesToUpload = Array.isArray(documents.files)
        ? documents.files
        : [];
      const documentRequirements = Array.isArray(documents.documentRequirements)
        ? documents.documentRequirements
        : [];

      // Append JSON data
      fd.append(
        "json",
        JSON.stringify({
          ...formData,
          documents: {
            documentRequirements,
            files: filesToUpload.map((file) => ({
              documentId: file.documentId,
              documentName: file.documentName,
            })),
          },
        })
      );

      // Append files with document IDs as field names
      filesToUpload.forEach((file) => {
        if (file.originFileObj) {
          fd.append(file.documentId, file.originFileObj);
        }
      });

      const res = await customRequest("put", endpoint, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application submitted successfully");
      return res.data;
    } catch (err) {
      console.log(err, "errerr");
      toast.error("Submission failed");
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
        console.log(a.payload.data, "sdfsdfsdfs");
        s.formData = { ...s.formData, ...mapDraftToSections(a.payload.data) };

        // 🔸  use step from DB if present, fallback to firstIncompleteStep()
        const stepFromDb = a.payload.data.currentStep;
        s.currentStep =
          typeof stepFromDb === "number"
            ? stepFromDb
            : firstIncompleteStep(s.formData);
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
