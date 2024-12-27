import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData, deleteData  } from "../../../../services/apiEndpoints";
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

// Update a receipt
export const updateReceipt = createAsyncThunk(
  "receipts/updateReceipt",
  async ({ id, formValues }, { rejectWithValue }) => {
    try {
      const storedSchoolId = localStorage.getItem("SelectedschoolId");
      const schoolId = storedSchoolId || "";

      const academicYearId = getAY(); // Fetch active academic year

      // Merge in the schoolId and academicYear
      const payload = {
        ...formValues,
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
      formData.append("receiver[name]", payload.receiver.name);
      formData.append("receiver[email]", payload.receiver.email);
      formData.append("receiver[phone]", payload.receiver.phone);
      formData.append("receiver[address]", payload.receiver.address);

      // 3) Append lineItems as nested array fields
      payload.lineItems.forEach((item, index) => {
        formData.append(`lineItems[${index}][revenueType]`, item.revenueType);
        formData.append(`lineItems[${index}][quantity]`, item.quantity);
        formData.append(`lineItems[${index}][total]`, item.total);
      });

      // 4) Append file if present
      if (payload.document) {
        formData.append("document", payload.document);
      }

      // Now PUT the FormData
      const response = await putData(`/finance/revenue/update/receipt/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.message === "Receipt updated successfully") {
        toast.success("Receipt updated successfully!");
        return response.data; // Return the updated receipt data
      } else {
        toast.error(response?.message || "Failed to update receipt.");
        return rejectWithValue(response?.message || "Failed to update receipt.");
      }
    } catch (error) {
      toast.error(error.message || "Error updating receipt.");
      return rejectWithValue(error.message || "Error updating receipt.");
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

// Fetch Receipt Dashboard Card Data
export const fetchReceiptCardData = createAsyncThunk(
  "receipts/fetchReceiptCardData",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      // Automatically fetch the academic year ID
      const academicYearId = getAY();

      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (year) queryParams.append("year", year);
      if (month) queryParams.append("month", month);
      if (academicYearId) queryParams.append("academicYearId", academicYearId);

      const response = await getData(`/finance/revenue/card-data?${queryParams.toString()}`);

      if (response?.success) {
        return response.data;
      } else {
        toast.error(response?.message || "Failed to fetch receipt card data.");
        return rejectWithValue(response?.message || "Failed to fetch receipt card data.");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching receipt card data.");
      return rejectWithValue(error.message || "Error fetching receipt card data.");
    }
  }
);

// Delete Receipt
export const deleteReceipt = createAsyncThunk(
  "receipts/deleteReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteData(`/finance/revenue/delete/receipt/${id}`);

      if (response?.message === "Receipt deleted successfully") {
        toast.success("Receipt deleted successfully!");
        return id; // Return the ID of the deleted receipt for client-side state updates
      } else {
        toast.error(response?.message || "Failed to delete receipt.");
        return rejectWithValue(response?.message || "Failed to delete receipt.");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting receipt.");
      return rejectWithValue(error.message || "Error deleting receipt.");
    }
  }
);
