import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { getData, postData } from "../../../../../services/apiEndpoints";


// Fetch all parents
export const fetchAllParent = createAsyncThunk(
  "user/allParent",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = localStorage.getItem("say");
       dispatch(setShowError(false));
      const response = await getData(`/admin/all/Parents?say=${say}`);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); 
    }
  }
);
export const updateParent = createAsyncThunk(
  "user/updateParent",
  async ({data}, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = localStorage.getItem("say");
      dispatch(setShowError(false));
      const response = await postData(`/admin/parent/update?say=${say}`,data);
      toast.success('Parent update successfull');
      dispatch(fetchAllParent())
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); 
    }
  }
);
