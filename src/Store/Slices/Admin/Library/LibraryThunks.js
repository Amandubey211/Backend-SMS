import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { toggleSidebar } from "./LibrarySlice";
import {
  ErrorMsg,
  handleError,
} from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear";
import {
  getData,
  postData,
  putData,
  deleteData,
  customRequest,
} from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";

// Fetch Books Thunk
export const fetchBooksThunk = createAsyncThunk(
  "library/fetchBooks",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY(); // Replace localStorage.getItem("say") with getAY()
      dispatch(setShowError(false)); // Reset error visibility
      const getRole = getUserRole(getState);
      console.log(say, "ddddddddd");
      const response = await getData(`/${getRole}/all/bookNames?say=${say}`); // Use getData for API calls
      return response?.books; // Safely access books using optional chaining
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

export const fetchBooksDetailsThunk = createAsyncThunk(
  "library/fetchBooksDetails",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY(); // Replace localStorage.getItem("say") with getAY()
      dispatch(setShowError(false)); // Reset error visibility
      const getRole = getUserRole(getState);
      console.log(say, "ddddddddd");
      const response = await getData(`/${getRole}/all/book?say=${say}`); // Use getData for API calls
      return response?.books; // Safely access books using optional chaining
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Centralized error handling
    }
  }
);

// Add Book Thunk
export const addBookThunk = createAsyncThunk(
  "library/addBook",
  async (formData, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY(); // Dynamically fetch the 'say' parameter
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      // Use postData to send FormData
      const response = await customRequest(
        "post",
        `/${getRole}/add_book?say=${say}`,
        formData,
        // Additional headers for the request

        {
          "Content-Type": "multipart/form-data",
        }
      );

      // Handle successful response
      toast.success("Book added successfully!");
      dispatch(toggleSidebar());
      dispatch(fetchBooksThunk()); // Refresh the list of books
      return response?.book; // Return the added book data safely
    } catch (error) {
      // Centralized error handling
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Book Thunk
export const deleteBookThunk = createAsyncThunk(
  "library/deleteBook",
  async (bookId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY(); // Replace localStorage.getItem("say") with getAY()
      await deleteData(`/${getRole}/delete/book/${bookId}?say=${say}`); // Use deleteData
      toast.success("Book deleted successfully!");
      return bookId; // Return the deleted book ID
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Book Thunk
export const updateBookThunk = createAsyncThunk(
  "library/updateBook",
  async ({ bookId, formData }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY(); // Replace localStorage.getItem("say") with getAY()
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await customRequest('PUT',
        `/${getRole}/update/book/${bookId}?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      toast.success("Book updated successfully!");
      dispatch(fetchBooksThunk());
      return response?.book; // Safely access book using optional chaining
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Book Issues Thunk
export const fetchBookIssuesThunk = createAsyncThunk(
  "library/fetchBookIssues",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY(); // Replace localStorage.getItem("say") with getAY()
      const getRole = getUserRole(getState);
      dispatch(setShowError(false)); // Reset error visibility
      const response = await getData(`/${getRole}/all/bookIssue?say=${say}`); // Use getData
      return response?.books; // Safely access books using optional chaining
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Issue Book Thunk
export const issueBookThunk = createAsyncThunk(
  "library/issueBook",
  async (issueData, { rejectWithValue, dispatch,getState }) => {
    try {
      const say = getAY(); // Replace localStorage.getItem("say") with getAY()
      const getRole = getUserRole(getState);
      const { id, ...bookIssueData } = issueData;
      const url = id
        ? `/${getRole}/update/bookIssue/${id}?say=${say}`
        : `/${getRole}/issue_book?say=${say}`;
      const method = id ? "put" : "post";

      const response = await customRequest(method, url, bookIssueData); // Use customRequest for dynamic methods

      dispatch(fetchBookIssuesThunk());

      toast.success(
        id
          ? "Book issue updated successfully!"
          : "Book issue created successfully!"
      );

      return response?.book; // Safely access book using optional chaining
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
