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
export const addScoreCardCellData = createAsyncThunk(
  "scoreCard/addScoreCardCellData",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(`/${role}/scoreCard/add/cell/${data.classId}?say=${say}`, data);
      console.log("response", response);
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


