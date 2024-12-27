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
      
      const storedSchoolId = localStorage.getItem("SelectedschoolId");
      const schoolId = storedSchoolId || "";

      
      const academicYearId = getAY(); 

      // Merge in the schoolId and academicYear
      const payload = {
        ...formValues,      // tax, discount, penalty, totalPaidAmount, etc.
        schoolId,
        academicYear: academicYearId,
      };

      // Create FormData
      const formData = new FormData();

      // 1) Append simple scalar fields
      formData.append("tax", payload.tax);
      formData.append("discount", payload.discount);
      formData.append("penalty", payload.penalty);
      formData.append("totalPaidAmount", payload.totalPaidAmount);
      formData.append("govtRefNumber", payload.govtRefNumber);
      formData.append("remark", payload.remark);
      formData.append("schoolId", payload.schoolId);
      formData.append("academicYear", payload.academicYear);

      // 2) Append "receiver" as nested fields
      //    e.g. receiver[name], receiver[email], etc.
      formData.append("receiver[name]", payload.receiver.name);
      formData.append("receiver[email]", payload.receiver.email);
      formData.append("receiver[phone]", payload.receiver.phone);
      formData.append("receiver[address]", payload.receiver.address);

      // 3) Append lineItems as nested array fields
      //    lineItems[0][revenueType], lineItems[0][quantity], ...
      payload.lineItems.forEach((item, index) => {
        formData.append(`lineItems[${index}][revenueType]`, item.revenueType);
        formData.append(`lineItems[${index}][quantity]`, item.quantity);
        formData.append(`lineItems[${index}][total]`, item.total);
      });

      // 4) Append file if present
      if (payload.document) {
        console.log(payload.document)
        formData.append("document", payload.document);
      }

      // For debugging, you can do:
      // console.log([...formData.entries()]);

      // Now POST the FormData
      console.log(formData)
      const response = await postData("/finance/revenue/create/receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.success) {
        toast.success("Receipt created successfully!");
        return response.data; // or whatever data the API returns
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
      const response = await putData(`/finance/revenue/cancel/receipt/${id}`);
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
