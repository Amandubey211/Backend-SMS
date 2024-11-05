import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import toast from "react-hot-toast";
import { toggleSidebar } from "./LibrarySlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch Books Thunk
export const fetchBooksThunk = createAsyncThunk(
  "library/fetchBooks",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/all/book?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.books;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Add Book Thunk
export const addBookThunk = createAsyncThunk(
  "library/addBook",
  async (bookData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(`${baseUrl}/admin/add_book?say=${say}`, bookData, {
        headers: { Authentication: token },
      });
      toast.success("Book added successfully!");
      dispatch(toggleSidebar());
      dispatch(fetchBooksThunk());
      return response.data.book;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Book Thunk
export const deleteBookThunk = createAsyncThunk(
  "library/deleteBook",
  async (bookId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      await axios.delete(`${baseUrl}/admin/delete/book/${bookId}?say=${say}`, {
        headers: { Authentication: token },
      });
      toast.success("Book deleted successfully!");
      return bookId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Book Thunk
export const updateBookThunk = createAsyncThunk(
  "library/updateBook",
  async ({ bookId, formData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/update/book/${bookId}?say=${say}`,
        formData,
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Book updated successfully!");
      dispatch(fetchBooksThunk());
      return response.data.book;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Book Issues Thunk
export const fetchBookIssuesThunk = createAsyncThunk(
  "library/fetchBookIssues",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/all/bookIssue?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.books;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Issue Book Thunk
export const issueBookThunk = createAsyncThunk(
  "library/issueBook",
  async (issueData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const { id, ...bookIssueData } = issueData;
      const url = id
        ? `${baseUrl}/admin/update/bookIssue/${id}?say=${say}`
        : `${baseUrl}/admin/issue_book?say=${say}`;
      const method = id ? "put" : "post";

      const response = await axios({
        url,
        method,
        data: bookIssueData,
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
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
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
