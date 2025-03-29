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


export const fetchEntity = createAsyncThunk(
  "finance/fetchEntity",

  async ({ EntityType, search, page, limit}, { rejectWithValue, dispatch, getState }) => {

    try {
      
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/entity/get?say=${say}`,{ EntityType, search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createEntity = createAsyncThunk(
  "finance/createEntity",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/entity/add?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        dispatch(
          fetchEntity({
            search: "",
            page: 1,
            limit: 10,
          })
        )
       }else{
        toast.error(response.message);
       }
        fetchEntity()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Entity not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const updateEntity = createAsyncThunk(
  "finance/updateEntity",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/entity/update/${data.id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchEntity({
          search: "",
          page: 1,
          limit: 10,
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchEntity()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Entity not updated');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


