import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";

// Fetch dashboard cards
export const fetchDashboardCards = createAsyncThunk(
  "dashboard/fetchCards",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/api/dashboard/sections`, {
        headers: {
          Authentication: `${token}`,
        },
      });

      if (response.data.success) {
        console.log("API Response for Dashboard Cards:", response.data);
        return response.data;
      } else {
        return rejectWithValue("Failed to fetch dashboard data");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch dashboard data";
      return rejectWithValue(errorMessage);
    }
  }
);


// Fetch notices
export const fetchNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(`${baseUrl}/admin/all/notices`, {
        headers: {
          Authentication: `${token}`,
        },
      });

      console.log("API Response for Notices:", response.data.notices); // Log API response
      return response.data.notices;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch notices";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);  // Reject with the error message instead of returning []
    }
  }
);


// Fetch children data
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async (_, { rejectWithValue }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("parent:token");

    if (!userData || !userData.email) {
      const errorMessage = "No guardian email found";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); // Reject if userData or email is not found
    }

    try {
      const response = await axios.get(
        `${baseUrl}/parent/api/children?email=${encodeURIComponent(userData.email)}`,
        {
          headers: {
            Authentication: `${token}`,
          },
        }
      );
      return response.data.children;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch children data";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); // Reject with the error message instead of returning []
    }
  }
);


// Fetch accounting data (fees, paid, unpaid, etc.)
export const fetchAccountingData = createAsyncThunk(
  "dashboard/fetchAccountingData",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      const errorMessage = "Token not found";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage); // Reject if the token is missing
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
      return rejectWithValue(errorMessage);  // Reject with error message instead of returning null
    }
  }
);

