import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { customRequest, getData, postData } from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";


// Fetch all parents
export const fetchAllParent = createAsyncThunk(
  "user/allParent",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
       dispatch(setShowError(false));
      const response = await getData(`/all/Parents?say=${say}`);
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
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await customRequest('put',`/${getRole}/parent/update?say=${say}`,data,   {
        "Content-Type": "multipart/form-data",
      }
);
      toast.success('Parent update successfull');
      dispatch(fetchAllParent())
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); 
    }
  }
);
