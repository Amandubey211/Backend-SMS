import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";

// Fetch all quotations
export const fetchAllQuotations = createAsyncThunk(
  "quotations/fetchAllQuotations",
  async (params, { rejectWithValue, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      const response = await getData(`/${getRole}/revenue/all/quotation?say=${say}`, params);
      if (response) {
        return response;
      } else {
        toast.error(response?.message || "Failed to fetch quotations.");
        return rejectWithValue(response?.message || "Failed to fetch quotations.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching quotations.");
    }
  }
);

// Create a new quotation
export const addQuotation = createAsyncThunk(
  "quotations/addQuotation",
  async (data, { rejectWithValue, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      const response = await postData(`/${getRole}/revenue/create/quotation?say=${say}`, data);
      if (response?.success) {
        toast.success("Quotation created successfully!");
        return response.data;
      } else {
        toast.error(response?.message || "Failed to create quotation.");
        return rejectWithValue(response?.message || "Failed to create quotation.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error creating quotation.");
    }
  }
);

// Cancel a quotation
export const cancelQuotation = createAsyncThunk(
  "quotations/cancelQuotation",
  async (id, { rejectWithValue, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const response = await putData(`/${getRole}/revenue/cancel/quotation/${id}`);
      if (response?.success) {
        toast.success("Quotation canceled successfully!");
        return response.data;
      } else {
        toast.error(response?.message || "Failed to cancel quotation.");
        return rejectWithValue(response?.message || "Failed to cancel quotation.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error canceling quotation.");
    }
  }
);

// Fetch Dashboard CardData
export const fetchQuotationCardData = createAsyncThunk(
  "quotations/fetchCardData",
  async (params, { rejectWithValue, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      const response = await getData(`/${getRole}/dashboard/quotation/cardData?academicYearId=${say}`, params);
      if (response?.success) {
        //toast.success("Quotation canceled successfully!");
        return response.data;
      } else {
        //toast.error(response?.message || "Failed to cancel quotation.");
        return rejectWithValue(response?.message || "Failed to fetch quotation cardData.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching quotation cardData.");
    }
  }
);


export const updateQuotationStatus = createAsyncThunk(
  "quotations/updateQuotationStatus",
  async ({ id, status }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      const response = await putData(`/${getRole}/revenue/update/quotation/${id}`, { status });
      if (response?.success) {
        toast.success(`Quotation ${status} successfully!`);
        return response.data;
      } else {
        toast.error(response?.message || `Failed to ${status} quotation.`);
        return rejectWithValue(response?.message || `Failed to ${status} quotation.`);
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error canceling quotation.");
    }
  }
);