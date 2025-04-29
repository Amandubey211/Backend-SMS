// src/store/slices/admissionThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAY } from "../../../../Utils/academivYear";
import { putData, getData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";

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

// ── 3️⃣ Fetch Admission Options by School-ID thunk ───────────────────────────
export const fetchAdmissionOptionsBySchoolId = createAsyncThunk(
  "schoolRegistration/fetchAdmissionOptionsBySchoolId",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setShowError(false));

      const schoolId = getState().common.user.userDetails.schoolId;

      // Fetch admission options from backend API using the schoolId
      const response = await getData(
        `/student_diwan/admission/option/${schoolId}`
      );
      return response.data || []; // assuming the response contains admissionOptions
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// ── 4️⃣ Update School Admission Options thunk ────────────────────────────────
export const updateSchoolOption = createAsyncThunk(
  "schoolRegistration/updateSchoolOption",
  async ({ admissionOptions }, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setShowError(false));
      const schoolId = getState().common.user.userDetails.schoolId;
      // Make API call to update school details with admissionOptions
      const response = await putData(
        `/student_diwan/update_school/${schoolId}`,
        {
          admissionOptions,
        }
      );

      // Show success message after updating
      toast.success("School admission options updated successfully.");

      // Fetch the updated school data (or handle as needed)
      dispatch(fetchAdmissionOptionsBySchoolId());

      return response.data; // Assuming the response contains the updated data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
