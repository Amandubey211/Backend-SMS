import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from the Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch Unverified Students
export const fetchUnverifiedStudents = createAsyncThunk(
  "verification/fetchUnverifiedStudents",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const say = localStorage.getItem("say");
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/get_unverified_student_details?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (!response.data.students || response.data.students.length === 0) {
        return rejectWithValue("No unverified students found.");
      }
      return response.data.students;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Rejected Students
export const fetchRejectedStudents = createAsyncThunk(
  "verification/fetchRejectedStudents",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const say = localStorage.getItem("say");
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/get_rejected_student_details?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );

      if (!response.data.students || response.data.students.length === 0) {
        return rejectWithValue("No rejected students found.");
      }
      return response.data.students;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Verify Student and Send Credentials
export const verifyStudent = createAsyncThunk(
  "verification/verifyStudent",
  async (verificationDetails, { rejectWithValue, getState, dispatch }) => {
    const say = localStorage.getItem("say");
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);

      // Step 1: Verify Student
      const verifyResponse = await axios.put(
        `${baseUrl}/admin/verify_student_info?say=${say}`,
        verificationDetails,
        { headers: { Authentication: token } }
      );

      if (!verifyResponse.data.success) {
        return rejectWithValue(
          verifyResponse.data.msg || "Failed to verify student"
        );
      }
      toast.success(verifyResponse.data.msg || "Student verified successfully");

      // Step 2: Assign Class to Student (if verified)
      if (verificationDetails.isVerifiedDocuments === "verified") {
        const assignClassDetails = {
          studentId: verificationDetails.studentId,
          presentClassId: verificationDetails.presentClassId,
        };

        const assignResponse = await axios.put(
          `${baseUrl}/admin/assign_class?say=${say}`,
          assignClassDetails,
          { headers: { Authentication: token } }
        );

        if (!assignResponse.data.success) {
          return rejectWithValue(
            assignResponse.data.msg || "Failed to assign class"
          );
        }
        toast.success(assignResponse.data.msg || "Class assigned successfully");
        dispatch(fetchUnverifiedStudents());
      } else {
        dispatch(fetchRejectedStudents());
      }

      // Step 3: Send Login Credentials after Verification
      const mailConfiguration = {
        studentId: verificationDetails.studentId,
        descriptionOnReject: verificationDetails?.rejectionReason,
      };

      const sendCredentialsResponse = await axios.post(
        `${baseUrl}/admin/send_login_credential?say=${say}`,
        mailConfiguration,
        { headers: { Authentication: token } }
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
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign Class to Student
export const assignClassToStudent = createAsyncThunk(
  "verification/assignClassToStudent",
  async (classDetails, { rejectWithValue, getState, dispatch }) => {
    const say = localStorage.getItem("say");
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const { data } = await axios.put(
        `${baseUrl}/admin/assign_class?say=${say}`,
        classDetails,
        {
          headers: { Authentication: token },
        }
      );
      if (data.success) {
        return data;
      }
      return rejectWithValue(data.msg || "Failed to assign class");
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
