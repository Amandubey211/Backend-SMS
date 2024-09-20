import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../config/Common";

// Fetch Unverified Students
export const fetchUnverifiedStudents = createAsyncThunk(
  "verification/fetchUnverifiedStudents",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token

      const response = await axios.get(
        `${baseUrl}/admin/get_unverified_student_details`,
        {
          headers: { Authentication: `Bearer ${token}` }, // Use token in headers
        }
      );
      return response.data.students;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch unverified students"
      );
    }
  }
);

// Fetch Rejected Students
export const fetchRejectedStudents = createAsyncThunk(
  "verification/fetchRejectedStudents",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token

      const response = await axios.get(
        `${baseUrl}/admin/get_rejected_student_details`,
        {
          headers: { Authentication: `Bearer ${token}` }, // Use token in headers
        }
      );
      return response.data.students;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch rejected students"
      );
    }
  }
);

// Verify Student and Send Credentials
export const verifyStudent = createAsyncThunk(
  "verification/verifyStudent",
  async (verificationDetails, { rejectWithValue, getState, dispatch }) => {
    try {
      const { common } = getState(); // Get state
      const token = common.auth.token; // Extract token

      // Step 1: Verify Student
      const verifyResponse = await axios.put(
        `${baseUrl}/admin/verify_student_info`,
        verificationDetails,
        { headers: { Authentication: `Bearer ${token}` } } // Use token in headers
      );

      if (!verifyResponse.data.success) {
        return rejectWithValue(
          verifyResponse.data.msg || "Failed to verify student"
        );
      }

      toast.success(verifyResponse.data.msg || "Student verified successfully");

      // Step 2: Assign Class to Student (only if student is verified)
      if (verificationDetails.isVerifiedDocuments === "verified") {
        const assignClassDetails = {
          studentId: verificationDetails.studentId,
          presentClassId: verificationDetails.presentClassId,
        };

        const assignResponse = await axios.put(
          `${baseUrl}/admin/assign_class`,
          assignClassDetails,
          { headers: { Authentication: `Bearer ${token}` } } // Use token in headers
        );

        if (!assignResponse.data.success) {
          return rejectWithValue(
            assignResponse.data.msg || "Failed to assign class"
          );
        }

        toast.success(assignResponse.data.msg || "Class assigned successfully");
      }

      // Step 3: Send Login Credentials after Verification
      const mailConfiguration = {
        studentId: verificationDetails.studentId,
        descriptionOnReject: verificationDetails?.rejectionReason,
      };

      const sendCredentialsResponse = await axios.post(
        `${baseUrl}/admin/send_login_credential`,
        mailConfiguration,
        { headers: { Authentication: `Bearer ${token}` } } // Use token in headers
      );

      if (!sendCredentialsResponse.data.success) {
        return rejectWithValue(
          sendCredentialsResponse.data.msg || "Failed to send credentials"
        );
      }

      toast.success(
        sendCredentialsResponse.data.msg || "Credentials sent successfully"
      );

      return verifyResponse.data.student;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Assign Class to Student
export const assignClassToStudent = createAsyncThunk(
  "verification/assignClassToStudent",
  async (classDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );
      const { data } = await axios.put(
        `${baseUrl}/admin/assign_class`,
        classDetails,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      if (data.success) {
        return data;
      }
      return rejectWithValue(data.msg || "Failed to assign class");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Something went wrong."
      );
    }
  }
);
