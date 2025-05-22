import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";

export const addScoreCard = createAsyncThunk(
  "scoreCard/addScoreCard",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await postData(`/${role}/scoreCard/add?say=${say}`, data);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const getScoreCard = createAsyncThunk(
  "scoreCard/getScoreCard",

export const addScoreCardCellData = createAsyncThunk(
  "scoreCard/addScoreCardCellData",

  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));

      const response = await getData(`/${role}/scoreCard/get/${data}?say=${say}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const updateScoreCard = createAsyncThunk(
  "scoreCard/updateScoreCard",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(`/${role}/scoreCard/update/${data.scoreCardId}?say=${say}`,data);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const addCommonDataToScoreCard = createAsyncThunk(
  "scoreCard/addCommonDataToScoreCard",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(`/${role}/scoreCard/add/common/cell/${data.classId}?say=${say}`,data);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const reomoveCommonDataFromScoreCard = createAsyncThunk(
  "scoreCard/reomoveCommonDataFromScoreCard",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(`/${role}/scoreCard/remove/common/${data.classId}/${data.cellNumber}?say=${say}`,data);

      const response = await putData(`/${role}/scoreCard/add/cell/${data.classId}?say=${say}`, data);
      if(response.success){
        toast.success("Added Successfully");
      }else{
        toast.error("Cell Number is already Used");
      }

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


