import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setUserDetails } from "../reducers/userSlice";
import {
  customRequest,
  getData,
  putData,
} from "../../../../../services/apiEndpoints";
import { handleError } from "../../Alerts/errorhandling.action";
import { setShowError } from "../../Alerts/alertsSlice";

// Fetch user data
export const fetchUserData = createAsyncThunk(
  "User/fetchUserData",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(`/user/${userId}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch class data
export const fetchClassData = createAsyncThunk(
  "User/fetchClassData",
  async (classId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(`/class/${classId}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch subject data
export const fetchSubjectData = createAsyncThunk(
  "User/fetchSubjectData",
  async (subjectId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(`/subject/${subjectId}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePasswordThunk = createAsyncThunk(
  "User/updatePassword",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(`/api/password/change-password`, data);
      toast.success("Password update successfully");
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "User/updateAdmin",
  async ({ data }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await customRequest(
        "put",
        `/admin/update/admin_profile`,
        data,
        { "Content-Type": "multipart/form-data" }
      );
      toast.success("Profile update successfully");
      if (response?.success) {
        dispatch(setUserDetails(response?.data));
      }
      return response;
    } catch (error) {
      toast.error("Profile not updated");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchAdmissionOptions = createAsyncThunk(
  "User/fetchAdmissionOptions",
  async (schoolId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(
        `/student_diwan/admission/option/${schoolId}`
      );
      return response;
    } catch (error) {
      toast.error("Something is wrong");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const updateSchoolLogo = createAsyncThunk(
  "User/updateSchoolLogo",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await customRequest(
        "put",
        `/student_diwan/update_school/${data.schoolId}`,
        data,
        { "Content-Type": "multipart/form-data" }
      );
      return response;
    } catch (error) {
      toast.error("Something is wrong");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const updateAdmissionOptions = createAsyncThunk(
  "User/updateAdmissionOptions",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(
        `/student_diwan/update_school/${data.schoolId}`,
        { admissionOptions: data.admissionOptions }
      );
      return response;
    } catch (error) {
      toast.error("Update failed");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateStudentInfoThunk = createAsyncThunk(
  "Student/updateStudentInfo",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      // Clear any existing error messages
      dispatch(setShowError(false));

      // Perform the PUT request to update student info.
      // The endpoint here is assumed to be `/student/update`.
      const response = await customRequest(
        "put",
        `/admin/update/StudentInfo`, // Adjust this URL if your backend route differs
        data,
        { "Content-Type": "multipart/form-data" }
      );
      if (response.success) {
        // Notify the user of a successful update
        toast.success("Student Profile updated");
        return response;
      }
    } catch (error) {
      // Notify the user of failure and handle the error
      toast.error("Failed to update student information");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateParentInfoThunk = createAsyncThunk(
  "Parent/updateParentInfo",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await customRequest(
        "put",
        `/admin/parent/update`, // Adjust this URL if needed
        data,
        { "Content-Type": "multipart/form-data" }
      );
      if (response.success) {
        toast.success("Parent information updated successfully");
        return response;
      }
    } catch (error) {
      toast.error("Failed to update parent information");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
