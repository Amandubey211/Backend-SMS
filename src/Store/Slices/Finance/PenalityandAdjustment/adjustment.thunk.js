import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData, putData, postData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { toast } from "react-hot-toast"

// Thunk to create an adjustment
export const createAdjustment = createAsyncThunk(
  "penaltyandAdjustment/createAdjustment",
  async (formValues, { rejectWithValue }) => {
    try {
      // 1) Fetch necessary IDs
      const storedSchoolId = localStorage.getItem("SelectedschoolId");
      const schoolId = storedSchoolId || "";

      const academicYearId = getAY();

      // 2) Prepare payload
      const payload = {
        ...formValues,
        schoolId,
        academicYear: academicYearId,
      };

      // 3) Create FormData if needed (for file uploads)
      const formData = new FormData();
      formData.append("invoiceNumber", payload.invoiceNumber);
      formData.append("reason", payload.reason);
      // formData.append("discountType", payload.discountType);
      formData.append("discount", payload.discount);
      formData.append("adjustmentPenalty", payload.adjustmentPenalty);
      formData.append("tax", payload.tax);

      // Append items
      payload.items.forEach((item, index) => {
        formData.append(`items[${index}].revenueType`, item.revenueType);
        formData.append(`items[${index}].revenueReference`, item.revenueReference);
        formData.append(`items[${index}].quantity`, item.quantity);
        formData.append(`items[${index}].amount`, item.amount);
      });

      // Append document if exists
      // if (payload.document) {
      //   console.log("this is document uploaded:",payload.document);
      //   formData.append("document", payload.document);
      // }

      // 4) Make API request
      const response = await postData("/finance/penaltyAdjustment/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle response
      if (response?.status === 201) {
        toast.success("Adjustment created successfully!");
        return response.data; // Adjust based on your API response structure
      }

      if (response?.message === "Invoice marked as return and adjustment created successfully.") {
        toast.success("Adjustment created successfully!");
        return response; // Or response.data based on your API
      }

      // If response does not indicate success
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
