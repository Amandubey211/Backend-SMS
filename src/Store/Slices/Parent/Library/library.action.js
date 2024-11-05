import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem("say");
// Fetch library books thunk
export const fetchLibraryBooks = createAsyncThunk(
  'library/fetchLibraryBooks',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('parent:token');
    const say = localStorage.getItem("say")
    if (!token) {
      const errorMessage = "Authentication failed";
      dispatch(setShowError(true));
      dispatch(setErrorMsg(errorMessage));
      return rejectWithValue(errorMessage);
    }

    try {
      const response = await axios.get(`${baseUrl}/parent/all/bookIssue?say=${say}`, {
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
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch library data.";
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      dispatch(setErrorMsg(err?.message));
      return rejectWithValue(err?.message)
    }
  }
);
