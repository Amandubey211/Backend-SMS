// AuthSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  staffLogin,
  staffLogout,
  // any other staff actions if needed
} from "../actions/staffActions";
import {
  parentLogin,
  parentLogout,
  // ...
} from "../actions/parentActions";
import {
  studentLogin,
  studentLogout,
  qidVerification,
  registerStudentDetails,
  uploadStudentDocuments,
  // ...
} from "../actions/studentActions";
import { createAcademicYear } from "../actions/staffActions"; // or wherever this resides

const initialState = {
  isLoggedIn: false,
  role: null,
  token: null,
  AcademicYear: [],
  loading: false,
  error: null,
  selectedLanguage: "en",
  userRoles: [], // For multiple department roles
  permissions: [], // For storing the user’s current permission set
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    // 1) Common set/get methods
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },

    // 2) Language & Academic Year
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setAcademicYear: (state, action) => {
      state.AcademicYear = action.payload;
    },

    // 3) For roles that come from server (e.g., grouped roles)
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },

    // 4) Comprehensive reset
    resetState: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.token = null;
      state.AcademicYear = [];
      state.permissions = [];
      state.userRoles = [];
      state.loading = false;
      state.error = null;
      state.selectedLanguage = "en";
    },

    // 5) Example: storing user details from your login
    setUserDetails: (state, action) => {
      // Up to you how you want to store these in state
      const {
        schoolId,
        userId,
        profile,
        fullName,
        email,
        mobileNumber,
        position,
        employeeID,
        role,
        monthlySalary,
        active,
        dateOfBirth,
        schoolName,
      } = action.payload;

      state.schoolId = schoolId;
      state.userId = userId;
      state.profile = profile;
      state.fullName = fullName;
      state.email = email;
      state.mobileNumber = mobileNumber;
      state.position = position;
      state.employeeID = employeeID;
      state.role = role;
      state.monthlySalary = monthlySalary;
      state.active = active;
      state.dateOfBirth = dateOfBirth;
      state.schoolName = schoolName;
    },
  },
  extraReducers: (builder) => {
    builder
      // STAFF LOGIN
      .addCase(staffLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(staffLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
      })
      .addCase(staffLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // STAFF LOGOUT
      .addCase(staffLogout.fulfilled, (state) => {
        // On logout, reset all user-related data
        state.isLoggedIn = false;
        state.role = null;
        state.token = null;
        state.AcademicYear = [];
        state.permissions = [];
        state.userRoles = [];
        // Remove token from localStorage or cookies if applicable
        localStorage.removeItem("token");
      })

      // STUDENT LOGIN
      .addCase(studentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        // e.g., state.token = action.payload.token;
      })
      .addCase(studentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(studentLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.role = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      // QID Verification
      .addCase(qidVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(qidVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
      })
      .addCase(qidVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PARENT LOGIN
      .addCase(parentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
      })
      .addCase(parentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(parentLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.role = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      // REGISTER STUDENT
      .addCase(registerStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(registerStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        // state.signupSuccess = true;
      })
      .addCase(registerStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.signupSuccess = false;
      })

      // CREATE ACADEMIC YEAR
      .addCase(createAcademicYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAcademicYear.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPLOAD STUDENT DOCS
      .addCase(uploadStudentDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadStudentDocuments.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadStudentDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setToken,
  setRole,
  setAcademicYear,
  resetState,
  setSelectedLanguage,
  setUserRoles,
  setPermissions,
  clearPermissions,
  setUserDetails,
} = AuthSlice.actions;

export default AuthSlice.reducer;
