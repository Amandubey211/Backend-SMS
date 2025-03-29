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


export const fetchCategory = createAsyncThunk(
  "finance/fetchCategory",

  async ({ categoryType, search, page, limit}, { rejectWithValue, dispatch, getState }) => {

    try {
      
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/financeCategory/get?say=${say}`,{ categoryType, search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createCategory = createAsyncThunk(
  "finance/createCategory",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/financeCategory/add?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        dispatch(
          fetchCategory({
            categoryType: "",  
            search: "",
            page: 1,
            limit: 10,
          })
        )
       }else{
        toast.error(response.message);
       }
        fetchCategory()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Category not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const updateCategory = createAsyncThunk(
  "finance/updateCategory",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/financeCategory/update/${data.id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchCategory({
          categoryType: "",  
          search: "",
          page: 1,
          limit: 10,
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchCategory()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Category not updated');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


