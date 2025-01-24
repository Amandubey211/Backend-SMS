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
import { getAY } from "../../../../Utils/academivYear";
import toast from "react-hot-toast";
import { getUserRole } from "../../../../Utils/getRoles";


export const fetchOneStudentFee = createAsyncThunk(
  "studentFees/fetchOneStudentFee",
  async (studentId, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/revenue/get/student/fee/${studentId}?say=${say}`
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createStudentFee = createAsyncThunk(
  "studentFees/createStudentFee",
  async (feeData, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await postData(
        `/${getRole}/revenue/add/student/fee?say=${say}`,
        { allData: feeData }
      );
      if (response.success) {
        toast.success('Fees added  successfully!')
      }
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Please fill the required Fields !');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const createStudentFeeRecordForClass = createAsyncThunk(
  "studentFees/createStudentFeeRecordForClass",
  async (feeData, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await postData(
        `/${getRole}/revenue/add/class/student/fee?say=${say}`,
        { allData: feeData }
      );
      if (response.success) {
        toast.success('Fees added  successfully!')
      }
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Please fill the required Fields !');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const updateStudentFee = createAsyncThunk(
  "studentFees/updateStudentFee",
  async (data, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(
        `/${getRole}/revenue/update/student/fee/${data.feeId}`,
        data
      );
      if (response.success) {
        toast.success('Data update successfully!')
      } else {
        toast.error('Something is wrong')
      }
      return response;
    } catch (error) {
      toast.error('Something is wrong')
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const deleteStudentFees = createAsyncThunk(
  "studentFees/deleteStudentFees",
  async (data, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      // Since DELETE requests typically don't have a body, use customRequest to send data
      const response = await customRequest('delete', `/${getRole}/revenue/delete/student/fee`,
        data
      );

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const studentFeesGraph = createAsyncThunk(
  "studentFees/studentFeesGraph",
  async (params, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      // Default to the current year if no year is provided
      const currentYear = new Date().getFullYear();

      // Parse the `year` and `month` parameters to ensure they are numbers
      const year = parseInt(params.year) || currentYear; // Default to current year if not provided
      const month = params.view === "month" && params.month ? parseInt(params.month) : null; // Only parse month if view is "month"

      // Build the query string based on the `params`
      const queryParams = new URLSearchParams({
        year: year,
        ...(month && { month: month }), // Add month to the query string only if it's a valid number
      }).toString();

      console.log("Query Parameters:", queryParams); // For debugging

      // Fix: Dynamic year value and correct URL construction
      const url = `/${getRole}/dashboard/revenue/studentFeeGraph?${queryParams}`;

      // Make the API call
      const response = await getData(url);
      return response;
    } catch (error) {
      // Handle API errors
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const fetchStudentFeeCardData = createAsyncThunk(
  "studentFees/fetchStudentFeeCardData",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/dashboard/revenue/studentFeeDashboard`
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
