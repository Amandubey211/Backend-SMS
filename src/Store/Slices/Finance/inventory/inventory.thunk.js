// src/store/${getRole}/studentFees/studentFeesThunks.js
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


export const fetchInventory = createAsyncThunk(
  "finance/fetchInventory",

  async ({ status, search, page, limit}, { rejectWithValue, dispatch, getState }) => {

    try {
      
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/inventory/get?say=${say}`,{ status, search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchLowInventory = createAsyncThunk(
  "finance/fetchLowInventory",

  async ({ status, search, page, limit}, { rejectWithValue, dispatch, getState }) => {

    try {
      
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/inventory/low/get?say=${say}`,{ status, search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createInventory = createAsyncThunk(
  "finance/createInventory",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/inventory/add?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        dispatch(
          fetchInventory({
            status: "",  
            search: "",
            page: 1,
            limit: 10,
          })
        )
       }else{
        toast.error(response.message);
       }
        fetchInventory()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Inventory not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const updateInventory = createAsyncThunk(
  "finance/updateInventory",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/inventory/update/${data.id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchInventory({
         status: "",  
          search: "",
          page: 1,
          limit: 10,
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchInventory()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Inventory not updated');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


