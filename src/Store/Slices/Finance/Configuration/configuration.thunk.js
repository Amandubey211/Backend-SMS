// src/store/${getRole}/studentFees/studentFeesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import {
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import toast from "react-hot-toast";
import { getUserRole } from "../../../../Utils/getRoles";


export const fetchConfiguration = createAsyncThunk(
  "finance/fetchConfiguration",

  async ({ ConfigurationType, search, page, limit}, { rejectWithValue, dispatch, getState }) => {

    try {
      
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/get/nonfiguration?say=${say}`,{ ConfigurationType, search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createConfiguration = createAsyncThunk(
  "finance/createConfiguration",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/financeConfiguration/add?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        dispatch(
          fetchConfiguration({
            ConfigurationType: "",  
            search: "",
            page: 1,
            limit: 10,
          })
        )
       }else{
        toast.error(response.message);
       }
        fetchConfiguration()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Configuration not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const deleteConfiguration = createAsyncThunk(
  "finance/deleteConfiguration",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/configuration/delete/${data.id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchConfiguration({
          ConfigurationType: "",  
          search: "",
          page: 1,
          limit: 10,
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchConfiguration()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Configuration not Deleted');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


