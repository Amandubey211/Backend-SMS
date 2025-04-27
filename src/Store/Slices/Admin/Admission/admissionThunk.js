// src/store/slices/admissionThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserRole } from "../../../../Utils/getRoles";
import { getAY } from "../../../../Utils/academivYear";
import { putData, getData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";

// ── 1️⃣ Update attachments thunk ─────────────────────────────────────────────
export const updateSchoolAttachments = createAsyncThunk(
  "schoolRegistration/updateAttachments",
  async ({ attachments }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(`/student_diwan/attachment?say=${say}`, {
        attachments,
      });
      // backend returns { success: true, message, data: [ ...attachments ] }
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// ── 2️⃣ Fetch attachments by school-ID thunk ─────────────────────────────────
export const fetchSchoolAttachmentsById = createAsyncThunk(
  "schoolRegistration/fetchAttachmentsById",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setShowError(false));

      const schoolid = getState().common.user.userDetails.schoolId;

      const response = await getData(`/student_diwan/school/${schoolid}`);
      return response.data.attachments || [];
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
