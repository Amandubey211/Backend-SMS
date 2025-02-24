import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAY } from "../../../../Utils/academivYear";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData, putData, postData, customRequest } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { toast } from "react-hot-toast"
import { getUserRole } from "../../../../Utils/getRoles";

// Thunk to create an adjustment
export const createAdjustment = createAsyncThunk(
  "penaltyandAdjustment/createAdjustment",
  async (formValues, { rejectWithValue, getState }) => {
    try {
      console.log("Form values received: ", formValues);

      // 1) Fetch necessary IDs
      const storedSchoolId = localStorage.getItem("SelectedschoolId");
      const schoolId = storedSchoolId || "";
      const getRole = getUserRole(getState);
      const academicYearId = getAY();

      // 2) Prepare payload
      const payload = {
        formValues,
        schoolId,
        academicYear: academicYearId,
      };

      // 3) Create FormData for multipart/form-data request
      const formData = new FormData();

      // Append top-level fields
      formData.append("invoiceNumber", payload.formValues.invoiceNumber || "");
      formData.append("reason", payload.formValues.reason || "");
      formData.append("discountType", payload.formValues.discountType || "amount");
      formData.append("discount", payload.formValues.discount || 0);
      formData.append("adjustmentPenalty", payload.formValues.adjustmentPenalty || 0);
      formData.append("tax", payload.formValues.tax || 0);
      formData.append("subAmount", payload.formValues.subAmount || 0);
      formData.append("finalAmount", payload.formValues.finalAmount || 0);

      // Append items array if it exists and is an array
      if (Array.isArray(payload.formValues.items) && payload.formValues.items.length > 0) {
        payload.formValues.items.forEach((item, index) => {
          formData.append(`items[${index}].revenueType`, item?.revenueType || "");
          formData.append(`items[${index}].revenueReference`, item?.revenueReference || "");
          formData.append(`items[${index}].quantity`, item?.quantity || 0);
          formData.append(`items[${index}].amount`, item?.amount || 0);
        });
      } else {
        console.warn("Warning: items array is missing or empty.");
      }

      // Append document if exists and is a file
      if (payload.formValues.document instanceof File) {
        formData.append("document", payload.formValues.document);
      } else if (payload.formValues.document) {
        console.warn("Warning: Document is not a valid file.");
      }

      // 4) Make API request using customRequest
      const response = await customRequest(
        'POST',
        `/${getRole}/penaltyAdjustment/add`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      // 5) Handle response
      if (response?.status === 201) {
        toast.success("Adjustment created successfully!");
        return response.data; // Return response data if successful
      }

      if (response?.message === "Invoice marked as return and adjustment created successfully.") {
        toast.success("Adjustment created successfully!");
        return response; // Return response directly if success message matches
      }

      // 6) Handle failure response
      toast.error(response?.message || "Failed to create adjustment.");
      return rejectWithValue(response?.message || "Failed to create adjustment.");

    } catch (error) {
      // 7) Handle errors from the try block
      console.error("Error in createAdjustment thunk:", error);
      toast.error(error.message || "Error creating adjustment.");
      return rejectWithValue(error.message || "Error creating adjustment.");
    }
  }
);


export const fetchReturnInvoice = createAsyncThunk(
  "fetchreturnInvoice",
  async ({ page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" }, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));

    try {
      // Construct query parameters properly
      const queryParams = new URLSearchParams({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }).toString();

      // Fetch data from API
      const response = await getData(`/${getRole}/penaltyAdjustment/getAll?say=${say}&${queryParams}`);

      if (response?.data?.adjustments) {
        return {
          adjustments: response.data.adjustments,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalAdjustments: response.data.totalAdjustments,
        };
      } else {
        toast.error(response?.message || "Failed to fetch return invoices.");
        return rejectWithValue(response?.message || "Failed to fetch return invoices.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


export const fetchReturnCardData = createAsyncThunk(
  "card/fetchReturnInvoice",
  async (params, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await getData(
        `/${getRole}/dashboard/penaltyAdjustment/cardData?academicYearId=${say}`,
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
  async ({ params, id }, { dispatch, rejectWithValue, getState }) => {
    const say = getAY();
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await putData(
        `/${getRole}/penaltyAdjustment/cancel/${id}?say=${say}`
      );
      dispatch(fetchReturnInvoice(params));
      dispatch(fetchReturnCardData());
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
