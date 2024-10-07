import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";

// Fetch All Pages Thunk
export const fetchAllPages = createAsyncThunk(
  "pages/fetchAllPages",
  async ({ cid }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/api/pages/class/pages/${cid}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success) {
        return response.data.data; // Return the pages data
      } else {
        throw new Error("Failed to fetch pages");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching pages"
      );
    }
  }
);

// Fetch Page by ID Thunk
export const fetchPageById = createAsyncThunk(
  "pages/fetchPageById",
  async ({ pid }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(`${baseUrl}/admin/api/pages/${pid}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        return response.data.data; // Return the page data
      } else {
        throw new Error("Failed to fetch page");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching page"
      );
    }
  }
);

// Create Page Thunk
export const createPage = createAsyncThunk(
  "pages/createPage",
  async ({ pageData, cid }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.post(
        `${baseUrl}/admin/api/pages/class/${cid}`,
        pageData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // Return the created page
      } else {
        throw new Error("Failed to create page");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating page"
      );
    }
  }
);

// Update Page Thunk
export const updatePage = createAsyncThunk(
  "pages/updatePage",
  async ({ pageId, pageData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/api/pages/${pageId}`,
        pageData,
        {
          headers: {
            Authentication: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // Return the updated page
      } else {
        throw new Error("Failed to update page");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error updating page"
      );
    }
  }
);

// Delete Page Thunk
export const deletePage = createAsyncThunk(
  "pages/deletePage",
  async ({ pid }, { rejectWithValue, getState }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.delete(`${baseUrl}/admin/api/pages/${pid}`, {
        headers: { Authentication: `Bearer ${token}` },
      });

      if (response.data.success) {
        return pid; // Return the deleted page id
      } else {
        throw new Error("Failed to delete page");
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error deleting page"
      );
    }
  }
);
