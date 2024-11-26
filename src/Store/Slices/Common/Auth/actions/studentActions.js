import { createAsyncThunk } from "@reduxjs/toolkit";

import { resetState, setRole, setToken } from "../reducers/authSlice";
import { setUserDetails } from "../../User/reducers/userSlice";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { fetchAcademicYear } from "../../AcademicYear/academicYear.action";
import { customRequest, postData } from "../../../../../services/apiEndpoints";
import { handleError } from "../../Alerts/errorhandling.action";
import { setShowError } from "../../Alerts/alertsSlice";
import Cookies from 'js-cookie'
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
            schoolName: data?.schoolName,
          })
        );

        if (data.isVerifiedSchoolId) {
          await dispatch(fetchAcademicYear());
          const activeAcademicYear =
            await getState().common?.academicYear?.academicYears?.find(
              (i) => i.isActive == true
            );
          Cookies.set("say", activeAcademicYear?._id);
          return { redirect: "/student_dash" };
        } else {
          return { redirect: "/verify_qid" };
        }
      } else {
        return rejectWithValue(data.msg || "Login failed.");
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
    Cookies.remove('userToken');
    Cookies.remove('say');
    Cookies.remove('isAcademicYearActive');
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

// / Thunk for registering student details
export const registerStudentDetails = createAsyncThunk(
  "auth/registerStudentDetails",
  async (formData, { rejectWithValue,dispatch }) => {
    try {
      const response = await customRequest('post',
        `/student/student_register`,
        formData,   {
          "Content-Type": "multipart/form-data",
        }
);
      if (response.success) {
        toast.success("Registered Successfully");
        return response;
      } else {
        return rejectWithValue(
          response.msg || "Failed to save student details."
        );
      }
    } catch (error) {
     return handleError(error, dispatch, rejectWithValue);
  }}
);

// Thunk for uploading student documents
export const uploadStudentDocuments = createAsyncThunk(
  "auth/uploadStudentDocuments",
  async ({ email, schoolId, studentDocuments }, { rejectWithValue,dispatch }) => {
    try {
      if (!email) {
        return rejectWithValue("Email is required");
      }
      if (!schoolId) {
        return rejectWithValue("School ID is required");
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("schoolId", schoolId);
      studentDocuments.documents.forEach(({ file, label }) => {
        formData.append(`documents`, file);
        formData.append(`documentLabels`, label);
      });
      const response = await customRequest('post',
        `/student/upload_documents`,
        formData,   {
          "Content-Type": "multipart/form-data",
        }
    
      );
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(
          response.data.msg || "Failed to upload the document"
        );
      }
    } catch (error) {
     return handleError(error, dispatch, rejectWithValue);
    }
  }
);
