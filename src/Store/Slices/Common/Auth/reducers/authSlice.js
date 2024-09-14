import { createSlice } from "@reduxjs/toolkit";
import {
  staffLogin,
  staffLogout,
  createAcademicYear,
} from "../actions/staffActions"; // Updated actions file import

import { parentLogin, parentLogout } from "../actions/parentActions"; // Updated actions file import
import {
  studentLogin,
  studentLogout,
  qidVerification,
} from "../actions/studentActions";

const initialState = {
  isLoggedIn: false,
  role: null,
  token: null, // Store the token in the state
  AcademicYear: [],
  loading: false,
  error: null,
  selectedLanguage: "en",
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setAcademicYear: (state, action) => {
      state.AcademicYear = action.payload;
    },
    resetState: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.token = null;
      state.AcademicYear = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Staff login/logout
      .addCase(staffLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(staffLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        // state.role = action.payload.role;
        // state.token = action.payload.token;
        // state.AcademicYear = action.payload.academicYear;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(staffLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(staffLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.role = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      // Student login/logout
      .addCase(studentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.token);
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

      // Student QID verification
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

      // Parent login/logout
      .addCase(parentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        // state.role = action.payload.role;
        // state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
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
      });
  },
});

export const {
  setToken,
  setRole,
  setAcademicYear,
  resetState,
  setSelectedLanguage,
} = AuthSlice.actions;
export default AuthSlice.reducer;
