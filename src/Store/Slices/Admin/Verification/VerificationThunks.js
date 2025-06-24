import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";

// Fetch Unverified Students
export const fetchUnverifiedStudents = createAsyncThunk(
  "verification/fetchUnverifiedStudents",
  async (params, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/get_unverified_student_details?say=${say}`,
        params
      );

      if (!response.students || response.students?.length === 0) {
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/get_rejected_student_details?say=${say}`
      );

      if (!response.students || response.students?.length === 0) {
        return rejectWithValue("No rejected students found.");
      }
      return response.students;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Verify Student and Send Credentials
// export const verifyStudent = createAsyncThunk(
//   "verification/verifyStudent",
//   async ({verificationDetails,navigate}, { rejectWithValue, dispatch, getState }) => {
//     try {
//       const say = getAY();
//       const getRole = getUserRole(getState);
//       dispatch(setShowError(false));

//       // Step 1: Verify Student
//       const verifyResponse = await putData(
//         `/${getRole}/verify_student_info?say=${say}`,
//         verificationDetails
//       );

//       if (!verifyResponse.success) {
//         return toast.error(verifyResponse.msg);
//       }

//       // Collect success messages
//       let successMessages = [
//         verifyResponse.msg || "Student verified successfully.",
//       ];

//       // Step 2: Assign Class to Student (if verified)
//       if (verificationDetails.isVerifiedDocuments === "verified") {
//         const assignClassDetails = {
//           studentId: verificationDetails.studentId,
//           presentClassId: verificationDetails.presentClassId,
//         };

//         const assignResponse = await putData(
//           `/${getRole}/assign_class?say=${say}`,
//           assignClassDetails
//         );

//         if (!assignResponse?.success) {
//           return rejectWithValue(
//             assignResponse.data.msg || "Failed to assign class"
//           );
//         }

//         successMessages.push(
//           assignResponse.msg || "Class assigned successfully."
//         );
//         dispatch(fetchUnverifiedStudents());
//       } else {
//         dispatch(fetchRejectedStudents());
//       }

//       // Step 3: Send Login Credentials after Verification
//       const mailConfiguration = {
//         studentId: verificationDetails.studentId,
//         descriptionOnReject: verificationDetails?.rejectionReason,
//       };

//       const sendCredentialsResponse = await postData(
//         `/${getRole}/send_login_credential?say=${say}`,
//         mailConfiguration
//       );

//       if (!sendCredentialsResponse.success) {
//         return rejectWithValue(
//           sendCredentialsResponse.msg || "Failed to send credentials"
//         );
//       }

//       successMessages.push(
//         sendCredentialsResponse.msg || "Credentials sent successfully."
//       );

//       // Display one aggregated toast notification
//       toast.success(successMessages.join(" "));
//       // Navigate back after the process
//       navigate("/verify_students");
//       return verifyResponse.student;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// new verify sudent and send credentials compact toast message
export const verifyStudent = createAsyncThunk(
  "verification/verifyStudent",
  async (
    { verificationDetails, navigate },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));

      // Step 1: Verify Student
      const verifyResponse = await putData(
        `/${getRole}/verify_student_info?say=${say}`,
        verificationDetails
      );

      if (!verifyResponse.success) {
        return toast.error("Verification failed");
      }

      // Collect success messages
      let successMessages = ["Student verified"];

      // Step 2: Assign Class to Student (if verified)
      if (verificationDetails.isVerifiedDocuments === "verified") {
        const assignClassDetails = {
          studentId: verificationDetails.studentId,
          presentClassId: verificationDetails.presentClassId,
        };

        const assignResponse = await putData(
          `/${getRole}/assign_class?say=${say}`,
          assignClassDetails
        );

        if (!assignResponse?.success) {
          return rejectWithValue("Class assignment failed");
        }

        successMessages.push("Class assigned");
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
        `/${getRole}/send_login_credential?say=${say}`,
        mailConfiguration
      );

      if (!sendCredentialsResponse.success) {
        return rejectWithValue("Sending credentials failed");
      }

      successMessages.push("Credentials sent");

      toast.success(successMessages.join(", "));
      navigate("/verify_students");
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const data = await putData(
        `/${getRole}/assign_class?say=${say}`,
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
