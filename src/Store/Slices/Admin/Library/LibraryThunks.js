// src/Store/Slices/Admin/Library/LibraryThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";
import { toggleSidebar } from "./LibrarySlice";

// Fetch Books Thunk
export const fetchBooksThunk = createAsyncThunk(
  "library/fetchBooks",
  async (_, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/all/book`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.books;
    } catch (error) {
      // toast.error("Failed to fetch books.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add Book Thunk
export const addBookThunk = createAsyncThunk(
  "library/addBook",
  async (bookData, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.post(`${baseUrl}/admin/add_book`, bookData, {
        headers: { Authentication: `Bearer ${token}` },
      });
      toast.success("Book added successfully!");
      dispatch(toggleSidebar());
      dispatch(fetchBooksThunk());
      return response.data.book;
    } catch (error) {
      toast.error("Failed to add book.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Book Thunk
export const deleteBookThunk = createAsyncThunk(
  "library/deleteBook",
  async (bookId, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      await axios.delete(`${baseUrl}/admin/delete/book/${bookId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      toast.success("Book deleted successfully!");
      return bookId;
    } catch (error) {
      toast.error("Failed to delete book.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Book Thunk
export const updateBookThunk = createAsyncThunk(
  "library/updateBook",
  async ({ bookId, formData }, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.put(
        `${baseUrl}/admin/update/book/${bookId}`,
        formData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Book updated successfully!");
      dispatch(fetchBooksThunk());
      return response.data.book;
    } catch (error) {
      toast.error("Failed to update book.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Book Issues Thunk
export const fetchBookIssuesThunk = createAsyncThunk(
  "library/fetchBookIssues",
  async (_, { rejectWithValue, getState }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const response = await axios.get(`${baseUrl}/admin/all/bookIssue`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.books; // Adjusted field name
    } catch (error) {
      // toast.error("Failed to fetch book issues.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Issue Book Thunk
export const issueBookThunk = createAsyncThunk(
  "library/issueBook",
  async (issueData, { rejectWithValue, getState, dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;

    try {
      const { id, ...bookIssueData } = issueData;

      const url = id
        ? `${baseUrl}/admin/update/bookIssue/${id}`
        : `${baseUrl}/admin/issue_book`;

      const method = id ? "put" : "post";

      const response = await axios({
        url,
        method,
        data: bookIssueData,
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
      });

      dispatch(fetchBookIssuesThunk());

      toast.success(
        id
          ? "Book issue updated successfully!"
          : "Book issue created successfully!"
      );

      return response.data.book;
    } catch (error) {
      toast.error("Failed to process book issue.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
