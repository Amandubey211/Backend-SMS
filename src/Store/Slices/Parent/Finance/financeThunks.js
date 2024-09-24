import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";

// Fetch finance data for parent
export const fetchParentFinanceData = createAsyncThunk(
  "dashboard/fetchAccountingData",
  async () => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      toast.error("Token not found");
      return null;
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/api/fees`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch accounting data";
      toast.error(errorMessage);
      return null;
    }
  }
);
