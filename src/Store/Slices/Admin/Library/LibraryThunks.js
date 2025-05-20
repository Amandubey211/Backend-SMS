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

// --------------------------- BOOKS ---------------------------

// Fetch Books Thunk (simple list of book names)
export const fetchBooksThunk = createAsyncThunk(
  "library/fetchBooks",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(`/${getRole}/all/bookNames?say=${say}`);
      return response?.books;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Books with pagination details
export const fetchBooksDetailsThunk = createAsyncThunk(
  "library/fetchBooksDetails",
  async ({ page = 1, limit = 10 }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(
        `/${getRole}/all/book?say=${say}&page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Add Book Thunk
export const addBookThunk = createAsyncThunk(
  "library/addBook",
  async (formData, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await customRequest(
        "post",
        `/${getRole}/add_book?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      toast.success("Book added successfully!");
      dispatch(toggleSidebar());
      // const pageno = getState().library.currentPage || 1;
      dispatch(fetchBooksDetailsThunk({ page: 1, limit: 10 }));
      return response?.book;
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
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await customRequest(
        "PUT",
        `/${getRole}/update/book/${bookId}?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      toast.success("Book updated successfully!");
      dispatch(fetchBooksDetailsThunk({ page: 1, limit: 10 }));
      return response?.book;
    } catch (error) {
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
      const say = getAY();
      const response = await deleteData(
        `/${getRole}/delete/book/${bookId}?say=${say}`
      );
      if (response.success) {
        toast.success("Book deleted successfully!");
        dispatch(fetchBooksDetailsThunk({ page: 1, limit: 10 }));
        return bookId;
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// --------------------------- BOOK ISSUES ---------------------------

export const fetchBookIssuesThunk = createAsyncThunk(
  "library/fetchBookIssues",
  async ({ page = 1, limit = 10 }, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await getData(
        `/${getRole}/all/bookIssue?say=${say}&page=${page}&limit=${limit}`
      );
      return {
        issues: response?.books || [],
        pagination: response?.pagination || {
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
        },
      };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Issue Book Thunk
export const issueBookThunk = createAsyncThunk(
  "library/issueBook",
  async (issueData, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      const { id, ...bookIssueData } = issueData;
      const url = id
        ? `/${getRole}/update/bookIssue/${id}?say=${say}`
        : `/${getRole}/issue_book?say=${say}`;
      const method = id ? "put" : "post";

      const response = await customRequest(method, url, bookIssueData);
      dispatch(fetchBookIssuesThunk());
      if(response.success){
toast.success(
        id
          ? "Book issue updated successfully!"
          : "Book issue created successfully!"
      );
      }else{
       toast.error( response.message|| "Book not issued"); 
      }
      
      return response?.book;
    } catch (error) {
             toast.error( error?.response?.data?.message|| "Book not issued"); 
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// --------------------------- CATEGORIES ---------------------------

// Fetch All Categories
export const fetchCategoriesThunk = createAsyncThunk(
  "library/fetchCategories",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      // GET request to /:role/book/category
      const response = await getData(`/admin/book/category?say=${say}`);
      return response?.data || []; // 'data' property from the backend response
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Add Category
export const addCategoryThunk = createAsyncThunk(
  "library/addCategory",
  async (categoryData, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await postData(
        `/${getRole}/book/add/category?say=${say}`,
        categoryData
      );
      toast.success("Category created successfully!");
      return response?.data; // returning the new category object
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Category
export const updateCategoryThunk = createAsyncThunk(
  "library/updateCategory",
  async (
    { categoryId, categoryData },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await putData(
        `/${getRole}/book/update/category/${categoryId}?say=${say}`,
        categoryData
      );
      toast.success("Category updated successfully!");
      return response?.data; // updated category
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Category
export const deleteCategoryThunk = createAsyncThunk(
  "library/deleteCategory",
  async (categoryId, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const response = await deleteData(
        `/${getRole}/book/delete/category/${categoryId}?say=${say}`
      );
      if (response.success) {
        toast.success("Category deleted successfully!");
        return categoryId;
      } else {
        toast.error(response.response.data.message || "Cannot Delete Category");
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
