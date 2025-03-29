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


export const fetchOperationalExpenses  = createAsyncThunk(
  "finance/fetchOperationalExpenses ",
  async ({categoryId,search, page, limit}, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/staff/salaryWages?say=${say}`,{ categoryId,search, page, limit}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchOperationalExpensesStaff  = createAsyncThunk(
  "finance/fetchOperationalExpensesStaff",
  async ({type}, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/operationalExpenses/staffs?say=${say}`,{type}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createoperationalExpenses  = createAsyncThunk(
  "finance/createoperationalExpenses ",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/expense/add/operationalExpenses/?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        dispatch(
          fetchoperationalExpenses({
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
      toast.error('operationalExpenses not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateoperationalExpenses  = createAsyncThunk(
  "finance/updateoperationalExpenses ",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/operationalExpenses/update/${data.id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchoperationalExpenses ({
          search: "",
          page: 1,
          limit: 10,
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchoperationalExpenses ()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('operationalExpenses  not updated');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


