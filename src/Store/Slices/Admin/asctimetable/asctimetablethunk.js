import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ErrorMsg,
  handleError,
} from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";
import { postData, putData, getData } from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";

export const createTimeTable = createAsyncThunk(
  "admin/createTimeTable",
  async (timetableData, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const academicYearId = getAY();
      const response = await postData(
        `/${getRole}/ascTimeTable/create?say=${academicYearId}`,
        timetableData,
      );
      toast.success("Timetable created successfully");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to create timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateTimeTable = createAsyncThunk(
  "admin/updateTimeTable",
  async ({ id, timetableData }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/ascTimeTable/update/${id}`,
        timetableData
      );
      toast.success("Timetable updated successfully");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch all school timeTable
export const getSchoolTimeTable = createAsyncThunk(
  "admin/getSchoolTimeTable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/ascTimeTable/school?say=${say}`,
        data
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to load timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch class timeTable
export const getClassTimeTable = createAsyncThunk(
  "admin/getClassTimeTable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const { classId, sectionId } = data;

      const response = await getData(
        `/${getRole}/ascTimeTable/class?say=${say}&classId=${classId}&sectionId=${sectionId}`
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to load timetable");
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
