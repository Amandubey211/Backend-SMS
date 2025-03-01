import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";

export const libraryBooksStudent = createAsyncThunk(
  "books/libraryBooksStudent",
  async ({ page, limit, search, category }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const data = await getData(
        `/admin/all/book?say=${say}&page=${page}&limit=${limit}&search=${search}&category=${category}&`
      );
      return data;
    } catch (error) {
      console.error("Error in libraryBooksStudent:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
