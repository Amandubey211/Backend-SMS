import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";

// Fetch all receipts
export const fetchAllReceipts = createAsyncThunk(
  "receipts/fetchAllReceipts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData("/finance/revenue/all/receipt"); // Replace with your actual API endpoint

      if (response?.data) {
        // Extract data and other relevant fields from the response
        const { data } = response;
        console.log(data);
        // Return only the receipts array for simplicity
        return {
          receipts: data,
        };
      } else {
        return rejectWithValue(response?.message || "Failed to fetch receipts.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching receipts.");
    }
  }
);


// Create a receipt

export const createReceipt = createAsyncThunk(
  "receipts/createReceipt",
  async (formValues, { rejectWithValue }) => {
    try {
      const schoolId = localStorage.getItem('schoolId'); // Fetch schoolId from localStorage
      const academicYearId = getAY(); // Fetch academicYear using getAY()

      // Prepare the payload
      const payload = {
        ...formValues,
        schoolId,
        academicYear: academicYearId,
      };

      // Create FormData for file upload
      const formData = new FormData();
      for (const key in payload) {
        if (key === 'items') {
          formData.append('lineItems', JSON.stringify(payload[key]));
        } else if (key === 'document' && payload[key]) {
          formData.append('document', payload[key]);
        } else {
          formData.append(key, payload[key]);
        }
      }

      const response = await postData("/finance/revenue/create/receipt", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.success) {
        toast.success("Receipt created successfully!");
        return response.data;
      } else {
        toast.error(response?.message || "Failed to create receipt.");
        return rejectWithValue(response?.message || "Failed to create receipt.");
      }
    } catch (error) {
      toast.error(error.message || "Error creating receipt.");
      return rejectWithValue(error.message || "Error creating receipt.");
    }
  }
);

// Cancel a receipt
export const cancelReceipt = createAsyncThunk(
  "receipts/cancelReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await putData(`/finance/receipts/cancel/${id}`);
      if (response?.success) {
        toast.success("Receipt canceled successfully!");
        return response.data;
      } else {
        toast.error(response?.message || "Failed to cancel receipt.");
        return rejectWithValue(response?.message || "Failed to cancel receipt.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error canceling receipt.");
    }
  }
);
