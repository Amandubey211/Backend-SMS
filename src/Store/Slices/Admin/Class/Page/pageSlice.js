import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPages,
  fetchPageById,
  createPage,
  updatePage,
  deletePage,
} from "./pageThunk";

const initialState = {
  pages: [],
  page: null,
  loading: false,
  error: null,
  success: null,
};

const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = null; // Reset success state after a successful operation
    },
  },
  extraReducers: (builder) => {
    // Fetch All Pages
    builder
      .addCase(fetchAllPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = action.payload;
      })
      .addCase(fetchAllPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Page by ID
    builder
      .addCase(fetchPageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload;
      })
      .addCase(fetchPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Page
    builder
      .addCase(createPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.loading = false;
        state.pages.push(action.payload); // Add the new page to the pages array
        state.success = "Page created successfully!";
      })
      .addCase(createPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Page
    builder
      .addCase(updatePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.loading = false;
        // const index = state.pages.findIndex(
        //   (page) => page._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.pages[index] = action.payload; // Update the page in the pages array
        // }
        state.success = "Page updated successfully!";
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Page
    builder
      .addCase(deletePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = state.pages.filter((page) => page._id !== action.payload); // Remove the deleted page from the array
        state.success = "Page deleted successfully!";
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = pageSlice.actions;
export default pageSlice.reducer;
