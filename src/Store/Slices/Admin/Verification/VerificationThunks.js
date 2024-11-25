import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear"
import { getData, postData, putData } from "../../../../services/apiEndpoints";


// Fetch Unverified Students
export const fetchUnverifiedStudents = createAsyncThunk(
  "verification/fetchUnverifiedStudents",
  async (_, { rejectWithValue, dispatch }) => {

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await  getData(
        `/admin/get_unverified_student_details?say=${say}`
      );

      if (!response.students || response.students.length === 0) {
        return rejectWithValue("No unverified students found.");
      }
      return response.students;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Rejected Students
export const fetchRejectedStudents = createAsyncThunk(
  "verification/fetchRejectedStudents",
  async (_, { rejectWithValue, getState, dispatch }) => {
 
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(
        `/admin/get_rejected_student_details?say=${say}`);

      if (!response.students || response.students.length === 0) {
        return rejectWithValue("No rejected students found.");
      }
      return response.students;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Verify Student and Send Credentials
export const verifyStudent = createAsyncThunk(
  "verification/verifyStudent",
  async (verificationDetails, { rejectWithValue,  dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));

      // Step 1: Verify Student
      const verifyResponse = await putData(
        `/admin/verify_student_info?say=${say}`,
        verificationDetails
      );

      if (!verifyResponse.success) {
        return rejectWithValue(
          verifyResponse.data.msg || "Failed to verify student"
        );
      }
      toast.success(verifyResponse.msg || "Student verified successfully");

      // Step 2: Assign Class to Student (if verified)
      if (verificationDetails.isVerifiedDocuments == "verified") {
        const assignClassDetails = {
          studentId: verificationDetails.studentId,
          presentClassId: verificationDetails.presentClassId,
        };

        const assignResponse = await putData(
          `/admin/assign_class?say=${say}`,
          assignClassDetails
        );

        if (!assignResponse.success) {
          return rejectWithValue(
            assignResponse.data.msg || "Failed to assign class"
          );
        }
        toast.success(assignResponse.msg || "Class assigned successfully");
        dispatch(fetchUnverifiedStudents());
      } else {
        dispatch(fetchRejectedStudents());
      }

      // Step 3: Send Login Credentials after Verification
      const mailConfiguration = {
        studentId: verificationDetails.studentId,
        descriptionOnReject: verificationDetails?.rejectionReason,
      };

      const sendCredentialsResponse = await postData(
        `/admin/send_login_credential?say=${say}`,
        mailConfiguration
      );

      if (!sendCredentialsResponse.success) {
        return rejectWithValue(
          sendCredentialsResponse.msg || "Failed to send credentials"
        );
      }

      toast.success(
        sendCredentialsResponse.msg || "Credentials sent successfully"
      );
      return verifyResponse.student;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign Class to Student
export const assignClassToStudent = createAsyncThunk(
  "verification/assignClassToStudent",
  async (classDetails, { rejectWithValue, getState, dispatch }) => {
  
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const  data  = await putData(
        `/admin/assign_class?say=${say}`,
        classDetails
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
