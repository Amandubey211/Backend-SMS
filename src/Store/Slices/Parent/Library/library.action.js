import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from "../../../../config/Common";

// Fetch library books thunk
export const fetchLibraryBooks = createAsyncThunk(
  'library/fetchLibraryBooks',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('parent:token');

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/all/bookIssue`, {
        headers: {
          Authentication: `${token}`,
        },
      });

      return response.data.books.map((book) => ({
        ...book,
        issueDate: new Date(book.issueDate).toISOString(),
        returnDate: new Date(book.returnDate).toISOString(),
        bookName: book.bookId.name,
        bookCategory: book.bookId.category,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch library data.";
      return rejectWithValue(errorMessage);
    }
  }
);
