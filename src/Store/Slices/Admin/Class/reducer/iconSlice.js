// iconSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllIcons,
  createIcon,
  updateIcon,
  deleteIcon,
} from "../actions/iconThunk";

const initialState = {
  icons: [],
  selectedIcon: null,
  loading: false,
  error: null,
};

const iconSlice = createSlice({
  name: "classIcons",
  initialState,
  reducers: {
    resetIcons(state) {
      state.icons = [];
    },
    selectIcon(state, action) {
      state.selectedIcon = action.payload;
    },
    resetIconSelection(state) {
      state.selectedIcon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all icons lifecycle
      .addCase(fetchAllIcons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIcons.fulfilled, (state, action) => {
        state.loading = false;
        state.icons = action.payload;
      })
      .addCase(fetchAllIcons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create icon lifecycle
      .addCase(createIcon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIcon.fulfilled, (state, action) => {
        state.loading = false;
        state.icons.push(action.payload);
      })
      .addCase(createIcon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update icon lifecycle
      .addCase(updateIcon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIcon.fulfilled, (state, action) => {
        state.loading = false;
        // const index = state.icons.findIndex(
        //   (icon) => icon._id === action.payload._id
        // );
        // if (index !== -1) {
        //   state.icons[index] = action.payload;
        // }
      })
      .addCase(updateIcon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete icon lifecycle
      .addCase(deleteIcon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIcon.fulfilled, (state, action) => {
        state.loading = false;
        state.icons = state.icons.filter((icon) => icon._id !== action.payload);
      })
      .addCase(deleteIcon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetIcons, selectIcon, resetIconSelection } = iconSlice.actions;
export default iconSlice.reducer;
