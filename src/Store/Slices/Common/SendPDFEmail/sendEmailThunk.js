import { createAsyncThunk } from "@reduxjs/toolkit";
import { customRequest, postData } from "../../../../services/apiEndpoints";
import toast from "react-hot-toast";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getUserRole } from "../../../../Utils/getRoles";

export const sendEmail = createAsyncThunk(
  "sendEmail/send",
  async ({ id, type, payload }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);

      if (!id || !type || !payload?.receiver?.email) {
        return rejectWithValue("Missing required fields");
      }

      console.log("Sending email payload:", payload);

      const response = await customRequest('POST',`/${getRole}/invoice/send/${type}/${id}`, payload,{"Access-Control-Allow-Origin": "*"});

      if (response?.success) {
        return response.message;
      } else {
        toast.error(response?.message || "Failed to send email.");
        return rejectWithValue(response?.message || "Failed to send email.");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
