import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData, putData, postData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import {toast } from "react-hot-toast"

// Thunk to create an adjustment
export const createAdjustment = createAsyncThunk(
  "adjustments/createAdjustment",
  async (formValues, { rejectWithValue }) => {
    try {
      // 1) Fetch necessary IDs from local storage or context
      const storedSchoolId = localStorage.getItem("SelectedschoolId");
      const schoolId = storedSchoolId || "";

      // 2) Fetch academicYear
      const academicYearId = getAY(); // Ensure you have a utility function to get the academic year

      // 3) Merge formValues with schoolId and academicYear
      const payload = {
        ...formValues,
        schoolId,
        academicYear: academicYearId,
      };

      // 4) Create FormData if you need to send multipart/form-data
      // If no file uploads are required, you can send JSON instead
      const formData = new FormData();
      formData.append("invoiceNumber", payload.invoiceNumber);
      formData.append("reason", payload.reason);
      formData.append("discountType", payload.discountType);
      formData.append("discount", payload.discount);
      formData.append("tax", payload.tax);
      formData.append("adjustmentPenalty", payload.adjustmentPenalty);

      // Append items (array of objects)
      payload.items.forEach((item, index) => {
        formData.append(`items[${index}][revenueType]`, item.revenueType);
        formData.append(`items[${index}][revenueReference]`, item.revenueReference);
        formData.append(`items[${index}][quantity]`, item.quantity);
        formData.append(`items[${index}][amount]`, item.amount);
      });

      // 5) POST request to create adjustment
      const response = await postData("/finance/revenue/create/adjustment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle response
      if (response?.status === 201) {
        toast.success("Adjustment created successfully!");
        return response.data; // Adjust based on your API response
      }

      // Handle non-201 responses
      if (response?.message === "Invoice marked as return and adjustment created successfully.") {
        toast.success("Adjustment created successfully!");
        return response; // Or response.data based on your API
      }

      // If neither condition is met, treat as failure
      toast.error(response?.message || "Failed to create adjustment.");
      return rejectWithValue(response?.message || "Failed to create adjustment.");
    } catch (error) {
      toast.error(error.message || "Error creating adjustment.");
      return rejectWithValue(error.message || "Error creating adjustment.");
    }
  }
);


export const fetchReturnInvoice = createAsyncThunk(
  "fetchreturnInvoice",
  async (params, { dispatch, rejectWithValue }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/finance/penaltyAdjustment/getAll?say=${say}`,
        params
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const fetchReturnCardData = createAsyncThunk(
  "card/fetchReturnInvoice",
  async (params, { dispatch, rejectWithValue }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/finance/dashboard/penaltyAdjustment/cardData?say=${say}`,
        params
      );
      return response?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const cancleReturnInvoiceData = createAsyncThunk(
  "card/cancelReturnInvoice",
  async ({ params, id }, { dispatch, rejectWithValue }) => {
    const say = getAY();
    dispatch(setShowError(false));
    try {
      const response = await putData(
        `/finance/penaltyAdjustment/cancel/${id}?say=${say}`
      );
      dispatch(fetchReturnInvoice(params));
      dispatch(fetchReturnCardData());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
