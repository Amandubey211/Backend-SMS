import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";

// Fetch dashboard cards
export const fetchDashboardCards = createAsyncThunk(
  "dashboard/fetchCards",
  async () => {
    const token = localStorage.getItem("parent:token");

    if (!token) {
      toast.error("No token found");
      return null;
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/api/dashboard/sections`, {
        headers: {
          Authentication: `${token}`,
        },
      });

      console.log("API Response for Dashboard Cards:", response.data);  // Ensure the structure of the response
      return response.data;  // Return the entire response data if it matches the component's expectations
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch dashboard cards";
      console.error("Error fetching dashboard cards:", errorMessage);
      toast.error(errorMessage);
      return null; // Return null or an empty object if data fails to fetch
    }
  }
);

// Fetch notices
export const fetchNotices = createAsyncThunk(
  "dashboard/fetchNotices",
  async () => {
    const token = localStorage.getItem("parent:token");

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
      return [];  // Return an empty array or null if notices fail to load
    }
  }
);

// Fetch children data
export const fetchChildren = createAsyncThunk(
  "dashboard/fetchChildren",
  async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("parent:token");

    if (!userData || !userData.email) {
      toast.error("No guardian email found");
      return null;
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
      return []; // Return an empty array or null if children data fails to load
    }
  }
);

// Fetch accounting data (fees, paid, unpaid, etc.)
export const fetchAccountingData = createAsyncThunk(
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
      return null;  // Return null or an empty object if accounting data fails to load
    }
  }
);
