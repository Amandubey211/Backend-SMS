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


export const createStudentFee = createAsyncThunk(
  "studentFees/createStudentFee",
  async (feeData, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await postData(
        `/finance/revenue/add/student/fee?say=${say}`,
        {allData:feeData}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const updateStudentFee = createAsyncThunk(
  "studentFees/updateStudentFee",
  async (data , { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await putData(
        `/finance/revenue/update/student/fee/${data.feeId}`,
        data
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


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
