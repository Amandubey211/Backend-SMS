import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getUserRole } from "../../../../Utils/getRoles";

export const addInvoice = createAsyncThunk(
  "earnings/addInvoice",
  async (data, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await postData(`/${getRole}/invoice/create?say=${say}`, data);
      if (response.success) {
        toast.success("Invoice create successfully!");
      } else {
        toast.error('Please fill the required  Fields !')
      }
      return response.data
    } catch (error) {
      toast.error('Please fill the required  Fields !')
      return handleError(error, dispatch, rejectWithValue);
    }

  }
);

export const cancelInvoice = createAsyncThunk(
  "earnings/cancelInvoice",
  async (id, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await putData(`/${getRole}/invoice/cancel/${id}?say=${say}`);
      if (response.success) {
        toast.success("Invoice cancel successfully!");
      } else {
        toast.error("Something is wrong!");
      }
      return response.data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const completeInvoice = createAsyncThunk(
  "earnings/completeInvoice",
  async (id, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await putData(`/${getRole}/invoice/handleComplete/${id}?say=${say}`);
      if (response.success) {
        toast.success("Invoice completed successfully!");
      } else {
        toast.error("Something is wrong!");
      }
      return response.data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchInvoice = createAsyncThunk(
  "earnings/fetchInvoice",
  async (params, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await getData(`/${getRole}/invoice/get?say=${say}`, params);
      return response
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchInvoiceCard = createAsyncThunk(
  "earnings/fetchInvoiceCar",
  async (params, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await getData(`/${getRole}/dashboard/invoice/cardData?academicYearId=${say}`,);
      return response.data
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchInvoiceByNumber = createAsyncThunk(
  "earnings/fetchInvoiceByNumber",
  async (invoiceNumber, { dispatch, rejectWithValue,getState }) => {
    const say = getAY(); // Fetch active academic year
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      if (!invoiceNumber) {
        throw new Error("Invoice number is required.");
      }
      const response = await getData(`/${getRole}/invoice/getInvoiceByNumber?say=${say}&invoiceNumber=${invoiceNumber}`);
      if (response?.success) {
        toast.success("Invoice fetched successfully!");
        return response.data;
      } else {
        toast.error(response?.message || "Invoice not found.");
        return rejectWithValue(response?.message || "Invoice not found.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
