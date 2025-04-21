// src/store/${getRole}/studentFees/studentFeesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import toast from "react-hot-toast";
import { getUserRole } from "../../../../Utils/getRoles";
import { customRequest, getData, postData, putData } from "../../../../services/apiEndpoints";
import { isCancel } from "axios";


export const fetchOperationalExpenses  = createAsyncThunk(
  "finance/fetchOperationalExpenses ",
  async ({categoryId,search, page, limit,isCancel}, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/generalExpense?say=${say}`,{categoryId,search, page, limit,isCancel}
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createOperationalExpense = createAsyncThunk(
  "finance/createOperationalExpense",
   async ({data,navigate}, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(`/${getRole}/expense/add/generalExpense?say=${say}`,data);
      if (response.success) {
        toast.success('Expense created  successfully!');
        navigate('/finance/operational-expenses')
      }else{
        toast.error(response?.message);
      }
      return response;
    } catch (error) {
      console.error(error);
      toast.dismiss()
      toast.error('Expense not created');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const updateOperationalExpenses  = createAsyncThunk(
  "finance/updateOperationalExpenses",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await putData(
        `/${getRole}/expense/update/generalExpense/${data.id}?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchOperationalExpenses({
          search: "",
          page: 1,
          limit: 10,
          isCancel:false
        })
      ); 
     }else{
      toast.error("Something is Wrong");
     }
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Something is Wrong');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const deleteOperationalExpenses  = createAsyncThunk(
  "finance/deleteOperationalExpenses",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await customRequest('DELETE',
        `/${getRole}/expense/delete/generalExpense?say=${say}`,
        data
      );
     if(response.success){
      toast.success(response.message);
      dispatch(
        fetchOperationalExpenses({
          search: "",
          page: 1,
          limit: 10,
          isCancel:false
        })
      ); 
     }else{
      toast.error(response.message);
     }
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('operational Expenses  not delete');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);



export const fetchOperationalExpensesGraph = createAsyncThunk(
  "finance/ fetchOperationalExpensesGraph",

  async (params, { rejectWithValue, dispatch, getState }) => {

    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/expense/get/graph/generalExpense?say=${say}`,params
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

