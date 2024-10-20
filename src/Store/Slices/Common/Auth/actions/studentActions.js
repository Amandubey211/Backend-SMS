import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetState, setRole, setToken } from "../reducers/authSlice";
import { setUserDetails } from "../../User/reducers/userSlice";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

// Student login action
export const studentLogin = createAsyncThunk(
  "auth/studentLogin",
  async (studentDetails, { rejectWithValue, dispatch }) => {
    try {
      const { email, password } = studentDetails;

      if (!email || !password) {
        toast.error("Please provide email and password.");
        return rejectWithValue("Validation failed.");
      }

      const { data } = await axios.post(
        `${baseUrl}/auth/student/login`,
        studentDetails
      );

      if (data.success) {
        const tokenKey = process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY;
        localStorage.setItem(tokenKey, `Bearer ${data.token}`);
        localStorage.setItem("classId", `${data.classId}`);

        dispatch(setToken(data.token)); // Store token in state
        dispatch(setRole(data.role)); // Set role
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
            enrollment:data?.enrollment
          })
        );

        if (data.isVerifiedSchoolId) {
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
      return rejectWithValue(errorMessage);
    }
  }
);

// Student logout action
export const studentLogout = createAsyncThunk(
  "auth/studentLogout",
  async (_, { dispatch }) => {
    localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY);

    dispatch(resetState()); // Reset auth state
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
      const token = localStorage.getItem(
        process.env.REACT_APP_STUDENT_TOKEN_STORAGE_KEY
      );

      const { data } = await axios.post(
        `${baseUrl}/student/verify_school_id`,
        studentDetails,
        {
          headers: { Authorization: token },
        }
      );

      if (data.success) {
        dispatch(setRole("student"));
        return { role: "student" };
      } else {
        return rejectWithValue(data.msg || "Verification failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// / Thunk for registering student details
export const registerStudentDetails = createAsyncThunk(
  "auth/registerStudentDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/student/student_register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("Registered Successfully");
        return response.data;
      } else {
        return rejectWithValue(
          response.data.msg || "Failed to save student details."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "An error occurred while submitting the details.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for uploading student documents
export const uploadStudentDocuments = createAsyncThunk(
  "auth/uploadStudentDocuments",
  async ({ email, schoolId, studentDocuments }, { rejectWithValue }) => {
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

      const response = await axios.post(
        `${baseUrl}/student/upload_documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.msg || "Failed to upload the document"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        "An error occurred while uploading the documents.";
      return rejectWithValue(errorMessage);
    }
  }
);
