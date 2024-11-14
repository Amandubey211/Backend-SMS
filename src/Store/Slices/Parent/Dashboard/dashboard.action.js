import { createAsyncThunk } from "@reduxjs/toolkit";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import {  handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";
const say = localStorage.getItem("say");

// Fetch dashboard cards
export const fetchDashboardCards = createAsyncThunk(
  "dashboard/fetchCards",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/parent/api/dashboard/sections?say=${say}`);
      console.log("API Response for Dashboard Cards:", data);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch notices
export const fetchNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/admin/all/notices?say=${say}`);

      console.log("API Response for Notices:", data?.notices);
      return data?.notices;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch children data
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async (_, { rejectWithValue, dispatch }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData || !userData.email) {
      const errorMessage = "No guardian email found";
      dispatch(setErrorMsg(errorMessage));
      return rejectWithValue(errorMessage);
    }

    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/parent/api/children?say=${say}`);
      return data.children;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch accounting data (fees, paid, unpaid, etc.)
export const fetchAccountingData = createAsyncThunk(
  "dashboard/fetchAccountingData",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/parent/api/fees?say=${say}`);
      return data;
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
