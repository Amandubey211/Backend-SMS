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
import { isCancel } from "axios";


export const fetchPayroll  = createAsyncThunk(
  "finance/fetchPayroll ",
  async ({categoryId,search, page, limit,isCancel}, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/all/payroll?say=${say}`,{ categoryId,search, page, limit,isCancel}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchPayrollStaff  = createAsyncThunk(
  "finance/fetchPayrollStaff",
  async ({type}, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/payroll/staffs?say=${say}`,{type}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createPayroll  = createAsyncThunk(
  "finance/createPayroll",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/expense/add/payroll/?say=${say}`, data 
      );
      if(response.success){
        toast.success(response.message);
        data.navigate("/finance/payroll/list")
        dispatch(
          fetchPayroll({
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
      toast.error('Payroll not added');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updatePayroll  = createAsyncThunk(
  "finance/updatePayroll ",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/expense/update/payroll/${data.id}?say=${say}`,
        {data}
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchPayroll ({
          search: "",
          page: 1,
          limit: 10,
          isCancel:false
        })
      ); 

     }else{
      toast.error('Payroll  not updated');

     }
      
      fetchPayroll ()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Something is Wrong');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const deletePayroll  = createAsyncThunk(
  "finance/deletePayroll ",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await customRequest('DELETE',
        `/${getRole}/expense/delete/payroll/?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchPayroll ({
          search: "",
          page: 1,
          limit: 10,
          isCancel:false
        })
      ); 
     }else{
      toast.error(response.message);
     }
      
      fetchPayroll ()
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Payroll  not delete');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchPayrollGraph = createAsyncThunk(
  "finance/fetchPayrollGraph",

  async (params, { rejectWithValue, dispatch, getState }) => {

    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/graph/payroll?say=${say}`,params
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

