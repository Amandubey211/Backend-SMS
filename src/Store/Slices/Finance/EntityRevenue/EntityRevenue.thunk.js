// src/store/${getRole}/EntityRevenues/EntityRevenuesThunks.js
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


export const fetchAllEntityRevenueGraph = createAsyncThunk(
  "EntityRevenues/fetchAllEntityRevenueGraph",

  async (params, { rejectWithValue, dispatch, getState }) => {

    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/revenue/get/graph/externalRevenue?say=${say}`,params
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchAllEntityRevenue = createAsyncThunk(
  "EntityRevenues/fetchAllEntityRevenue",

  async (params, { rejectWithValue, dispatch, getState }) => {

    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/revenue/get/externalRevenue?say=${say}`,params
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const createEntityRevenue = createAsyncThunk(
  "EntityRevenues/createEntityRevenue",

  async ({data,navigate}, { rejectWithValue, dispatch, getState }) => {

    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const getRole = getUserRole(getState);
      const response = await postData(
        `/${getRole}/revenue/add/externalRevenue?say=${say}`,
         data
      );
      if (response.success) {
        toast.success('Invoice created  successfully!');
        navigate('/finance/entity/revenue/list')
      }else{
        toast.error(response?.message);
      }
      return response;
    } catch (error) {
      toast.dismiss()
      toast.error('Please fill the required Fields !');
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const cancelEntityRevenue = createAsyncThunk(
  "EntityRevenues/cancelEntityRevenue",

  async (data, { rejectWithValue, dispatch, getState }) => {

    try {

      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(
        `/${getRole}/revenue/cancel/externalRevenue/${data._id}`);
      if (response.success) {
        toast.success(response.message);
        dispatch(fetchAllEntityRevenue({ page: 1, limit: 10,search:'',isCancel:false }));
      } else {
        toast.error(response.message)
      }
      return response;
    } catch (error) {
      toast.error('Something is wrong')
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const deleteEntityRevenue = createAsyncThunk(
  "EntityRevenues/deleteEntityRevenue",

  async (data, { rejectWithValue, dispatch, getState }) => {

    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await customRequest('DELETE',
        `/${getRole}/revenue/delete/externalRevenue`,
        data
      );
      if (response.success) {
        toast.success(response.message);
        dispatch(fetchAllEntityRevenue({ page: 1, limit: 10,search:'',isCancel:false }));
      } else {
        toast.error(response.message)
      }
      return response;
    } catch (error) {
      toast.error('Something is wrong')
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);




export const EntityRevenueGraph = createAsyncThunk(
  "EntityRevenues/EntityRevenuesGraph",

  async (params, { rejectWithValue, dispatch, getState }) => {

    try {
     
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      // Default to the current year if no year is provided
      const currentYear = new Date().getFullYear();

      // Parse the `year` and `month` parameters to ensure they are numbers
      const year = parseInt(params.year) || currentYear; // Default to current year if not provided
      const month = params.view === "month" && params.month ? parseInt(params.month) : null; // Only parse month if view is "month"

      // Build the query string based on the `params`
      const queryParams = new URLSearchParams({
        year: year,
        ...(month && { month: month }), // Add month to the query string only if it's a valid number
      }).toString();

      console.log("Query Parameters:", queryParams); // For debugging

      // Fix: Dynamic year value and correct URL construction
      const url = `/${getRole}/dashboard/revenue/EntityRevenueGraph?${queryParams}`;

      // Make the API call
      const response = await getData(url);
      return response;
    } catch (error) {
      // Handle API errors
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const fetchEntityRevenueCardData = createAsyncThunk(
  "EntityRevenues/fetchEntityRevenueCardData",

  async (_, { rejectWithValue, dispatch, getState }) => {

    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/dashboard/revenue/EntityRevenueDashboard`
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
