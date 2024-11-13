import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { getData } from "../../../../services/apiEndpoints";
import { stdLibraryBooks } from "../../../../Utils/EndpoinUrls/stdEndpointUrl";

export const libraryBooksStudent = createAsyncThunk(
  "books/libraryBooksStudent",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false)); // Hide any previous error message
      // Use the getData function from apiEndpoints to make the API call
      const data = await getData(stdLibraryBooks);
      return data; // Return the data to the Redux store
    } catch (error) {
      console.error("Error in libraryBooksStudent:", error);
      handleError(error, dispatch, rejectWithValue);
    }
  }
);
