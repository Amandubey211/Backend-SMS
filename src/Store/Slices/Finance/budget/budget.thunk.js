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

export const fetchBudgetsummary  = createAsyncThunk(
  "finance/fetchBudgetsummary",
  async ({subCategory,search, page, limit,financialYearId}, {rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/budget/get/summary?say=${say}`,{ subCategory,search, page, limit,financialYearId}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchBudget  = createAsyncThunk(
  "finance/fetchBudget",
  async ({categoryId,search, page, limit}, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/budget/get?say=${say}`,{ categoryId,search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createBudget  = createAsyncThunk(
  "finance/createBudget ",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/budget/add?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        dispatch(
          fetchBudget ({
            search: "",
            page: 1,
            limit: 10,
          })
        )
       }else{
        toast.error(response.message);
       }
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Budget not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateBudget  = createAsyncThunk(
  "finance/updateBudget ",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/budget/update/${data?._id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchBudget ({
          search: "",
          page: 1,
          limit: 10,
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchBudget ()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Budget  not updated');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


