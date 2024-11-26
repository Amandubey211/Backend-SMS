// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { baseUrl } from "../../../../../config/Common";
// import { fetchClassDetails } from "../actions/classThunk";
// import { setSubjects } from "./subjectSlice";
// import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
// import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
// import toast from "react-hot-toast";

// const say = localStorage.getItem("say");

// // Helper function to get the token from Redux state
// const getToken = (state, rejectWithValue, dispatch) => {
//   const token = state.common.auth?.token;
//   if (!token) {
//     dispatch(setShowError(true));
//     dispatch(setErrorMsg("Authentication Failed"));
//     return rejectWithValue("Authentication Failed");
//   }
//   return `Bearer ${token}`;
// };

// // Centralized error handling
// const handleError = (error, dispatch, rejectWithValue) => {
//   const err = ErrorMsg(error);
//   dispatch(setShowError(true));
//   dispatch(setErrorMsg(err.message));
//   return rejectWithValue(err.message);
// };

// // Fetch subjects by classId
// export const fetchSubjects = createAsyncThunk(
//   "subject/fetchSubjects",
//   async (classId, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const response = await axios.get(
//         `${baseUrl}/admin/subject/${classId}?say=${say}`,
//         {
//           headers: { Authentication: token },
//         }
//       );
//       const { data } = response.data;
//       dispatch(setSubjects(data)); // Update the subjects state using the setSubjects action
//       return data;
//     } catch (err) {
//       return handleError(err, dispatch, rejectWithValue);
//     }
//   }
// );

// // Create a new subject
// export const createSubject = createAsyncThunk(
//   "subject/createSubject",
//   async (subjectData, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const response = await axios.post(
//         `${baseUrl}/admin/subject?say=${say}`,
//         subjectData,
//         {
//           headers: { Authentication: token },
//         }
//       );
//       toast.success("Subject created successfully");
//       dispatch(fetchClassDetails(subjectData.classId));
//       return response.data.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Update an existing subject
// export const updateSubject = createAsyncThunk(
//   "subject/updateSubject",
//   async (
//     { subjectId, subjectData },
//     { rejectWithValue, getState, dispatch }
//   ) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const response = await axios.put(
//         `${baseUrl}/admin/subject/${subjectId}?say=${say}`,
//         subjectData,
//         {
//           headers: { Authentication: token },
//         }
//       );
//       toast.success("Subject updated successfully");
//       dispatch(fetchClassDetails(subjectData.classId));
//       return response.data.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Delete a subject
// export const deleteSubject = createAsyncThunk(
//   "subject/deleteSubject",
//   async ({ subjectId, classId }, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       await axios.delete(`${baseUrl}/admin/subject/${subjectId}?say=${say}`, {
//         headers: { Authentication: token },
//       });
//       dispatch(fetchClassDetails(classId));
//       toast.success("Subject deleted successfully");
//       return subjectId;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// subjectThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../../../services/apiEndpoints"; // Adjust the path as necessary
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setSubjects } from "./subjectSlice"; // Adjust the path as necessary
import { fetchClassDetails } from "../actions/classThunk"; // Adjust the path as necessary
import toast from "react-hot-toast";
import { getAY } from "../../../../../Utils/academivYear";

/**
 * Centralized error handling function.
 *
 * @param {Object} error - The error object caught in the catch block.
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Function} rejectWithValue - The Redux thunk reject function.
 * @returns {any} - Returns the rejected value with the error message.
 */

/**
 * Thunk for fetching all subjects by class ID.
 *
 * @param {string} classId - The ID of the class to fetch subjects for.
 * @returns {Promise<Array>} - The list of subjects.
 */
export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async (classId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject/${classId}`;
      const params = { say };
      const response = await getData(endpoint, { params });

      if (response && response.success) {
        dispatch(setSubjects(response.data)); // Update the subjects state using the setSubjects action
        return response.data; // Assuming 'data' contains the list of subjects
      } 
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk for creating a new subject.
 *
 * @param {Object} subjectData - The data for the new subject.
 * @returns {Promise<Object>} - The created subject data.
 */
export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (subjectData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject`;
      const params = { say };
      const response = await postData(endpoint, subjectData, { params });

      if (response && response.success) {
        toast.success("Subject created successfully");
        dispatch(fetchClassDetails(subjectData.classId)); // Refresh class details
        return response.data.data; // Assuming 'data' contains the created subject
      } else {
        throw new Error(response.message || "Failed to create subject");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk for updating an existing subject.
 *
 * @param {Object} payload - The payload containing subject ID and data.
 * @param {string} payload.subjectId - The ID of the subject to update.
 * @param {Object} payload.subjectData - The updated subject data.
 * @returns {Promise<Object>} - The updated subject data.
 */
export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async ({ subjectId, subjectData }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject/${subjectId}`;
      const params = { say };
      const response = await putData(endpoint, subjectData, { params });

      if (response && response.success) {
        toast.success("Subject updated successfully");
        dispatch(fetchClassDetails(subjectData.classId)); // Refresh class details
        return response.data.data; // Assuming 'data' contains the updated subject
      } else {
        throw new Error(response.message || "Failed to update subject");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Thunk for deleting a subject.
 *
 * @param {Object} payload - The payload containing subject ID and class ID.
 * @param {string} payload.subjectId - The ID of the subject to delete.
 * @param {string} payload.classId - The ID of the class to refresh after deletion.
 * @returns {Promise<string>} - The ID of the deleted subject.
 */
export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async ({ subjectId, classId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const endpoint = `/admin/subject/${subjectId}`;
      const params = { say };
      const response = await deleteData(endpoint, { params });

      if (response && response.success) {
        toast.success("Subject deleted successfully");
        dispatch(fetchClassDetails(classId)); // Refresh class details
        return subjectId;
      } else {
        throw new Error(response.message || "Failed to delete subject");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
