import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData, deleteData } from "../../../ApiService";
import { handleError } from "../../../utils/handleError"; 
import { setShowError } from "../../Common/common.slice"; 

export const createShift = createAsyncThunk(
  "shift/createShift",
  async (shiftData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await postData("/transport/create-shift", shiftData);
      return data;
    } catch (error) {
      console.error("Error in createShift:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const getAllShifts = createAsyncThunk(
  "shift/getAllShifts",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/get-shifts?page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      console.error("Error in getAllShifts:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const getShiftById = createAsyncThunk(
  "shift/getShiftById",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await getData(`/transport/get-shift/${id}`);
      return data;
    } catch (error) {
      console.error("Error in getShiftById:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateShift = createAsyncThunk(
  "shift/updateShift",
  async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await putData(`/transport/update-shift/${id}`, updatedData);
      return data;
    } catch (error) {
      console.error("Error in updateShift:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const toggleShiftStatus = createAsyncThunk(
  "shift/toggleShiftStatus",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await putData(`/transport/toggle-shift/${id}/status`);
      return data;
    } catch (error) {
      console.error("Error in toggleShiftStatus:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const deleteShift = createAsyncThunk(
  "shift/deleteShift",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const data = await deleteData(`/transport/delete-shift/${id}`);
      return data;
    } catch (error) {
      console.error("Error in deleteShift:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
