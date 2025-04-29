// src/store/slices/schoolRegistrationSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  updateSchoolAttachments,
  fetchSchoolAttachmentsById,
  fetchAdmissionOptionsBySchoolId,
  updateSchoolOption, // Import the new thunk
} from "./admissionThunk";

const initialState = {
  attachments: [], // current attachments array
  admissionOptions: [], // new state for admission options
  loading: false, // spinner control for both fetch & update
  error: null, // error message
};

const schoolRegistrationSlice = createSlice({
  name: "admissionAttachment",
  initialState,
  reducers: {
    clearAttachmentsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchSchoolAttachmentsById ─────────────────────────────────────────
      .addCase(fetchSchoolAttachmentsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolAttachmentsById.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = action.payload;
      })
      .addCase(fetchSchoolAttachmentsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ── updateSchoolAttachments ─────────────────────────────────────────────
      .addCase(updateSchoolAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchoolAttachments.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = action.payload;
      })
      .addCase(updateSchoolAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ── fetchAdmissionOptionsBySchoolId ───────────────────────────────────
      .addCase(fetchAdmissionOptionsBySchoolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissionOptionsBySchoolId.fulfilled, (state, action) => {
        state.loading = false;
        state.admissionOptions = action.payload;
      })
      .addCase(fetchAdmissionOptionsBySchoolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ── updateSchoolOption ──────────────────────────────────────────────────
      .addCase(updateSchoolOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchoolOption.fulfilled, (state, action) => {
        state.loading = false;
        state.admissionOptions = action.payload; // Update state with the new admission options
      })
      .addCase(updateSchoolOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearAttachmentsError } = schoolRegistrationSlice.actions;
export default schoolRegistrationSlice.reducer;
