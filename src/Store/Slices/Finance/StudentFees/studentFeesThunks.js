// src/store/finance/studentFees/studentFeesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import {
  getData,
  postData,
  putData,
  deleteData,
  customRequest,
} from "../../../../services/apiEndpoints";

/**
 * Fetch all student fee records with query parameters.
 * @param {Object} params - The query parameters for filtering, sorting, pagination, etc.
 */
export const fetchAllStudentFees = createAsyncThunk(
  "studentFees/fetchAllStudentFees",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(
        "/finance/revenue/get/all/students/fee",
        params
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Fetch a single student fee record by student ID.
 * @param {string} studentId - The ID of the student.
 */
export const fetchOneStudentFee = createAsyncThunk(
  "studentFees/fetchOneStudentFee",
  async (studentId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(
        `/finance/revenue/get/student/fee/${studentId}`
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Create a new student fee record.
 * @param {Object} feeData - The data for the new student fee record.
 */
export const createStudentFee = createAsyncThunk(
  "studentFees/createStudentFee",
  async (feeData, { rejectWithValue, dispatch }) => {
    try {
      console.log('t',feeData);
      
      dispatch(setShowError(false));
      const response = await postData(
        "/finance/revenue/add/student/fee",
        {allData:feeData}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Update an existing student fee record.
 * @param {Object} payload - Contains feeId and updated feeData.
 * @param {string} payload.feeId - The ID of the fee record to update.
 * @param {Object} payload.feeData - The updated data for the fee record.
 */
export const updateStudentFee = createAsyncThunk(
  "studentFees/updateStudentFee",
  async ({ feeId, feeData }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(
        `/finance/revenue/update/student/fee/${feeId}`,
        feeData
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Delete student fee records by IDs.
 * @param {Array} ids - An array of fee record IDs to delete.
 */
export const deleteStudentFees = createAsyncThunk(
  "studentFees/deleteStudentFees",
  async (ids, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      // Since DELETE requests typically don't have a body, use customRequest to send data
      const response = await deleteData("/finance/revenue/delete/student/fee", {
        ids,
      });
      return { response, ids };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
