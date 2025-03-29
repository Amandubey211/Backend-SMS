import { createAsyncThunk } from "@reduxjs/toolkit";

import { resetState, setRole } from "../reducers/authSlice";
import { setUserDetails } from "../../User/reducers/userSlice";
import toast from "react-hot-toast";
import { fetchAcademicYear } from "../../AcademicYear/academicYear.action";
import { customRequest, postData } from "../../../../../services/apiEndpoints";
import { handleError } from "../../Alerts/errorhandling.action";
import { setShowError } from "../../Alerts/alertsSlice";
import Cookies from "js-cookie";
import { setLocalCookies } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";
// Student login action
export const studentLogin = createAsyncThunk(
  "auth/studentLogin",
  async (studentDetails, { rejectWithValue, dispatch, getState }) => {
    try {
      const { email, password } = studentDetails;

      if (!email || !password) {
        toast.error("Please provide email and password.");
        return rejectWithValue("Validation failed.");
      }

      const data = await postData(`/auth/student/login`, studentDetails);
      if (!data?.success) {
        const errorMessage =
          data?.msg || "Something went wrong. Please try again later.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
      if (data.success) {
        //  localStorage.setItem("classId", `${data.classId}`);
        //   dispatch(setToken(data?.token)); // Store token in state
        dispatch(setRole(data?.role)); // Set role
        dispatch(
          setUserDetails({
            schoolId: data?.schoolId,
            userId: data?.userId,
            profile: data?.profile,
            fullName: data?.fullName,
            admissionNumber: data?.admissionNumber,
            email: data?.email,
            mobileNumber: data?.mobileNumber,
            dateOfBirth: data?.dateOfBirth,
            Q_Id: data?.Q_Id,
            enrollment: data?.enrollment,
            className: data?.className,
            classId: data?.classId,
            sectionName: data?.sectionName,
            sectionId: data?.sectionId,
            schoolName: data?.schoolName,
            currency: data?.currency,
          })
        );

        if (data.isVerifiedSchoolId) {
          await dispatch(fetchAcademicYear());
          const activeAcademicYear =
            await getState().common?.academicYear?.academicYears?.find(
              (i) => i.isActive == true
            );
          setLocalCookies("say", activeAcademicYear?._id);
          return { redirect: "/student_dash" };
        } else {
          return { redirect: "/verify_qid" };
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Student logout action
export const studentLogout = createAsyncThunk(
  "auth/studentLogout",
  async (_, { dispatch }) => {
    dispatch(resetState()); // Reset auth state
    localStorage.clear();
    Cookies.remove("userToken");
    Cookies.remove("say");
    Cookies.remove("isAcademicYearActive");
    Cookies.remove("schoolId");
    Cookies.remove("SelectedschoolId");
    toast.success("Logged out successfully", {
      position: "bottom-left",
    });
    return true;
  }
);

// Student QID verification action
export const qidVerification = createAsyncThunk(
  "auth/qidVerification",
  async (studentDetails, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData(`/student/verify_school_id`, studentDetails);

      if (data.success) {
        dispatch(setRole("student"));

        return { role: "student" };
      } else {
        return rejectWithValue(data.msg || "Verification failed.");
      }
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Import getUserRole from your utils/helpers

// Thunk for registering student details
export const registerStudentDetails = createAsyncThunk(
  "auth/registerStudentDetails",
  async (formData, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get the user role; default to 'student' if not authenticated
      const role = getUserRole(getState) || "student";
      const endpoint = `/${role}/student_register`;

      const response = await customRequest("post", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

      if (response?.success) {
        toast.success("Registered Successfully");
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

// Thunk for uploading student documents
export const uploadStudentDocuments = createAsyncThunk(
  "auth/uploadStudentDocuments",
  async (
    { email, schoolId, studentDocuments },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      if (!email) {
        return rejectWithValue("Email is required");
      }
      if (!schoolId) {
        return rejectWithValue("School ID is required");
      }

      // Get the user role; default to 'student' if not authenticated
      const role = getUserRole(getState) || "student";
      const endpoint = `/${role}/upload_documents`;

      const formData = new FormData();
      formData.append("email", email);
      formData.append("schoolId", schoolId);
      studentDocuments.documents.forEach(({ file, label }) => {
        formData.append("documents", file);
        formData.append("documentLabels", label);
      });

      const response = await customRequest("post", endpoint, formData, {
        "Content-Type": "multipart/form-data",
      });

      if (response?.success) {
        return response;
      } else {
        return rejectWithValue(
          response?.data?.msg || "Failed to upload the document"
        );
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
