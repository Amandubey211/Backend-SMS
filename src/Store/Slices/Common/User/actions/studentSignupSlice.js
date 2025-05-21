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
import { stepSchemas } from "../../../../../Modules/LoginPages/Student/SignUp/Utils/validationSchemas";

const firstIncompleteStep = (data) => {
  for (let i = 0; i < stepSchemas.length; i += 1) {
    if (!stepSchemas[i].isValidSync(data, { strict: false })) return i;
  }
  return stepSchemas.length - 1; // Everything valid → last step (Submit)
};

const cacheKey = "signupStep1";
const loadCache = () => JSON.parse(sessionStorage.getItem(cacheKey) || "{}");

const extractPhone = (contactObj) => contactObj?.value ?? "";
const extractIsWA = (contactObj) => !!contactObj?.isWhatsApp;

const mapDraftToSections = (doc) => {
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

  return {
    guardian: {
      fatherInfo: fatherSection,
      motherInfo: motherSection,
      guardianInformation: {
        guardianName: doc.guardianName ?? "",
        guardianRelationToStudent: doc.guardianRelationToStudent ?? "",
        guardianContactNumber: doc.guardianContactNumber ?? "",
        guardianContactIsWhatsapp: false, // backend keeps plain string
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
      phoneNumberIsWhatsapp: doc.contactNumberIsWhatsapp || false,
      placeOfBirth: doc.placeOfBirth ?? "",
      religion: doc.religion ?? "",
      bloodGroup: doc.bloodGroup ?? "",
      email: doc.email, // verified already
      profile: doc.profile,
      Q_Id: doc.Q_Id ?? "",
      emergencyNumber: doc.emergencyNumber ?? "",
      nationality: doc.nationality ?? "",
      nativeLanguage: doc.nativeLanguage ?? "",
      passportNumber: doc.passportNumber ?? "",
      idExpiry: doc.idExpiry ?? "",
    },

    /* Language & Preferences tab */
    languagePreference: {
      secondLanguage: doc.languagePreferences?.secondLanguage ?? [],
      thirdLanguage: doc.languagePreferences?.thirdLanguage ?? [],
      valueEducation: doc.languagePreferences?.valueEducation ?? [],
      isLeftHanded: doc.languagePreferences?.isLeftHanded || false,
      medicalCondition: doc.languagePreferences?.medicalCondition || null,
    },

    /* Academic tab */
    academic: {
      ...doc.academicHistory, // previousSchoolName, previousClass, etc.
      sourceOfFee: doc.academicHistory?.sourceOfFee ?? "Parent",
      previousSchoolName: doc.academicHistory?.previousSchoolName ?? "",
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
  };
};

/* ---------- OTP Operations ---------- */
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

      if (res.success) {
        toast.success(res.message || "OTP Verified");

        return res;
      } else {
        toast.error(res.message || "Invalid OTP");
        throw new Error(res.message || "OTP Verification Failed");
      }
    } catch (err) {
      toast.error("OTP verification failed. Please try again.");
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

/* ---------- Draft Operations ---------- */
export const fetchStudentDraft = createAsyncThunk(
  "studentSignup/fetchDraft",
  async ({ email }, { rejectWithValue, dispatch }) => {
    try {
      const res = await getData(`/student/register/student?email=${email}`);
      if (res?.success && res?.exists) {
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
      const { formData, currentStep } = getState().common.studentSignup;
      console.log("Saving draft:", formData);
      if (currentStep >= 6) return true;

      const email = (formData.candidate?.email || "").toLowerCase();
      const schoolId = formData.school?.schoolId;

      if (!email || !schoolId) return true;

      await putData("/student/register/student?formStatus=draft", {
        ...formData,
        candidate: { ...formData.candidate, email },
        currentStep,
      });

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "draft-save-failed"
      );
    }
  }
);

/* ---------- Final Submission ---------- */
export const registerStudentDetails = createAsyncThunk(
  "studentSignup/register",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentStep } = getState().common.studentSignup;
      if (currentStep !== 7) {
        throw new Error("Registration can only be done on the final step");
      }

      const { formData } = getState().common.studentSignup;
      const endpoint = `/student/register/student`;
      // const email = (formData.candidate?.email || "").toLowerCase();

      const res = await putData(endpoint, {
        ...formData,
        candidate: {
          ...formData.candidate,
          email: formData.candidate.email.toLowerCase(),
        },
      });
      toast.success("Application submitted successfully");
      return res.data;
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed");
      return rejectWithValue(err.response?.data || err.message);
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
  languagePreference: {},
  academic: {},
  address: {},
  documents: [],
  consent: {},
};

const initialState = {
  currentStep: 0,
  formData: baseForm,

  /* Status flags */
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
    // Navigation actions
    setCurrentStep: (s, a) => {
      s.currentStep = a.payload;
    },
    nextStep: (s) => {
      if (s.currentStep < 7) s.currentStep += 1; // Updated to account for new step
    },
    prevStep: (s) => {
      if (s.currentStep > 0) s.currentStep -= 1;
    },

    // Form data actions
    updateFormData: (s, a) => {
      s.formData = {
        ...s.formData,
        ...a.payload,
        // Preserve file objects when updating form data
        candidate: {
          ...(s.formData.candidate || {}),
          ...(a.payload.candidate || {}),
        },
      };
    },
    resetSignup: () => initialState,

    // Email verification actions
    setEmailVerified: (s, a) => {
      s.isEmailVerified = true;
      s.verifiedEmail = a.payload;
      // Also annotate formData.school.isVerified so Yup passes
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
        s.verificationError = true;
      });

    /* ---------- Fetch draft ---------- */
    builder.addCase(fetchStudentDraft.fulfilled, (s, a) => {
      if (a.payload?.success && a.payload.exists) {
        s.formData = { ...s.formData, ...mapDraftToSections(a.payload.data) };

        // Use step from DB if present, fallback to firstIncompleteStep()
        const stepFromDb = a.payload.data.currentStep;
        s.currentStep =
          typeof stepFromDb === "number"
            ? stepFromDb
            : firstIncompleteStep(s.formData);
      }
    });

    /* ---------- Final submit ---------- */
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
