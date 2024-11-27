import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData } from "../../../../services/apiEndpoints";

// Fetch library books thunk
export const fetchLibraryBooks = createAsyncThunk(
  "library/fetchLibraryBooks",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(`/parent/all/bookIssue?say=${say}`);

      return data?.books?.map((book) => ({
        ...book,
        issueDate: new Date(book.issueDate).toISOString(),
        returnDate: new Date(book.returnDate).toISOString(),
        bookName: book.bookId.name,
        bookCategory: book.bookId.category,
      }));
    } catch (error) {
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
