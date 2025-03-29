import { createAsyncThunk } from "@reduxjs/toolkit";
import { getData, postData, putData, deleteData, customRequest } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";


export const fetchAllReceipts = createAsyncThunk(
  "receipts/fetchAllReceipts",
  async ({ page, limit,search}, { dispatch, rejectWithValue, getState }) => {
    const say = getAY(); // Ensure academic year is retrieved
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));

    try {
    

      const response = await getData(`/${getRole}/all/receipt`,{ page, limit,search});

      if (response?.data) {
        return  response
      } else {
       
        return rejectWithValue(response?.message || "Failed to fetch receipts.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);




// Create a receipt
export const createReceipt = createAsyncThunk(
  "receipts/createReceipt",
  async (data, { rejectWithValue, getState,dispatch }) => {
    const say = getAY(); // Ensure academic year is retrieved
    const getRole = getUserRole(getState);
    dispatch(setShowError(false));
    try {
      const response = await postData(
        `/${getRole}/create/receipt?say=${say}`,
      data
      );

      // Success response handling
      if (response?.success) {
        toast.success("Receipt created successfully!");
        return response.data || response;
      }else{
        toast.error(response?.message || "Failed to create receipt.");
        return rejectWithValue(response?.message || "Failed to create receipt.");
      }
    } catch (error) {
      
      toast.error(error.message || "Error creating receipt.");
      return rejectWithValue(error.message || "Error creating receipt.");
    }
  }
);

export const fetchReciptInvoiceData = createAsyncThunk(
  "receipts/fetchReciptInvoiceData",
  async (searchInvoiceNumber, { rejectWithValue , getState}) => {
    try {
      const getRole = getUserRole(getState);

      const say = getAY();
      const response = await getData(`/${getRole}/receipt/getData/${searchInvoiceNumber}?say=${say}`);

      if (response.success) {
        return response.data;
      } else {
        toast.error(response?.message || "Failed to Get Invoice data.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to Get Invoice data.");
      return rejectWithValue(error.message || "Failed to Get Invoice data.");
    }
  }
)






// Cancel a receipt
export const cancelReceipt = createAsyncThunk(
  "receipts/cancelReceipt",
  async (id, { rejectWithValue , getState}) => {
    try {
      const getRole = getUserRole(getState);
      const response = await putData(`/${getRole}/cancel/receipt/${id}`);
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
  async (_, { rejectWithValue , getState}) => {
    try {
      const getRole = getUserRole(getState);
      const say= getAY();
      const response = await getData(`/${getRole}/receipt/cardData`);
      return response;
      
    } catch (error) {
      
      return rejectWithValue(error.message || "Error fetching receipt card data.");
    }
  }
);


