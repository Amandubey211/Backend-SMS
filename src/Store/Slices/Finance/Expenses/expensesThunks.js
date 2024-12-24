// src/Store/Thunks/Finance/Expenses/expensesThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Ensure axios is installed and configured

// Base URL for API endpoints (adjust as needed)
const API_BASE_URL = "https://api.yourdomain.com/finance/expenses";

// Add a new expense
export const addExpenses = createAsyncThunk(
  "expenses/addExpenses",
  async ({ values, category }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add`, {
        ...values,
        categoryName: category,
      });
      return response.data;
    } catch (error) {
      // Extract error message
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add expense";
      return rejectWithValue(message);
    }
  }
);

// Update an existing expense
export const updateExpenses = createAsyncThunk(
  "expenses/updateExpenses",
  async ({ values, category, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update/${id}`, {
        ...values,
        categoryName: category,
      });
      return response.data;
    } catch (error) {
      // Extract error message
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update expense";
      return rejectWithValue(message);
    }
  }
);

// Fetch all expenses (optional, if needed)
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch expenses";
      return rejectWithValue(message);
    }
  }
);

// Fetch a single expense by ID (optional, if needed)
export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchExpenseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get/${id}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch expense";
      return rejectWithValue(message);
    }
  }
);
