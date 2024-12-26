import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";

// Fetch all quotations
export const fetchAllQuotations = createAsyncThunk(
  "quotations/fetchAllQuotations",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getData("/finance/revenue/all/quotation", params);
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
export const createQuotation = createAsyncThunk(
  "quotations/createQuotation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postData("/finance/quotations/create", data);
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
  async (id, { rejectWithValue }) => {
    try {
      const response = await putData(`/finance/quotations/cancel/${id}`);
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
