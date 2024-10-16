import { createSlice } from "@reduxjs/toolkit";
import { fetchGraduates } from "./graduate.action";

const initialState = {
  graduates: [],
  loading: false,
  error: null,
  selectedGraduate: null,
};

const graduateSlice = createSlice({
  name: "graduates",
  initialState,
  reducers: {
    setSelectedGraduate: (state, action) => {
      state.selectedGraduate = action.payload;
    },
    clearSelectedGraduate: (state) => {
      state.selectedGraduate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraduates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraduates.fulfilled, (state, action) => {
        state.loading = false;
        state.graduates = action.payload;
      })
      .addCase(fetchGraduates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch graduates";
      });
  },
});

export const { setSelectedGraduate, clearSelectedGraduate } = graduateSlice.actions;
export default graduateSlice.reducer;
