import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData, deleteData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";

export const fetchAllReceipts = createAsyncThunk(
  "receipts/fetchAllReceipts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const say=getAY();
      const response = await getData(`/finance/revenue/all/receipt?say=${say}&page=${page}&limit=${limit}`); // Backend API with pagination
      if (response?.data) {
        const { data, pagination } = response;
        return { receipts: data, pagination }; // Include pagination metadata
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
      // 1) Fetch schoolId
      const storedSchoolId = localStorage.getItem("SelectedschoolId");
      const schoolId = storedSchoolId || "";

      // 2) Fetch academicYear
      const say = getAY();

      // 3) Merge formValues with schoolId, academicYear
      const payload = {
        ...formValues,
        schoolId
      };

      // 4) Create FormData
      const formData = new FormData();
      formData.append("tax", payload.tax);
      formData.append("discountType", payload.discountType); // Add discountType to the payload
      formData.append("discount", payload.discount);
      formData.append("penalty", payload.penalty);
      formData.append("govtRefNumber", payload.govtRefNumber);
      formData.append("remark", payload.remark);
      formData.append("schoolId", payload.schoolId);
      formData.append("academicYear", payload.academicYear);
      formData.append("invoiceNumber", payload.invoiceNumber);

      // Receiver (nested)
      formData.append("receiver[name]", payload.receiver.name);
      formData.append("receiver[email]", payload.receiver.email);
      formData.append("receiver[phone]", payload.receiver.phone);
      formData.append("receiver[address]", payload.receiver.address);

      // Line Items (nested array)
      payload.lineItems.forEach((item, index) => {
        formData.append(`lineItems[${index}][revenueType]`, item.revenueType);
        formData.append(`lineItems[${index}][quantity]`, item.quantity);
        formData.append(`lineItems[${index}][total]`, item.total);
      });

      // Document (file) if present
      // if (payload.document) {
      //   console.log("Attaching document:", payload.document);
      //   formData.append("document", payload.document);
      // }

      // 5) POST
      const response = await postData(`/finance/revenue/create/receipt?say=${say}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success response handling
      if (response?.status === 201) {
        toast.success("Receipt created successfully!");
        return response.data;
      }

      if (response?.message === "Receipt created successfully") {
        toast.success("Receipt created successfully!");
        return response;
      }

      // Failure handling
      toast.error(response?.message || "Failed to create receipt.");
      return rejectWithValue(response?.message || "Failed to create receipt.");
    } catch (error) {
      console.error("Error creating receipt:", error);
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

      const response = await getData(`/finance/dashboard/receipt/cardData?${queryParams.toString()}`);

      if (response) {
        console.log(response)
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
