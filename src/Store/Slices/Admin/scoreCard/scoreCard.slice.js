import { createSlice } from "@reduxjs/toolkit";
import { addScoreCard } from "./scoreCard.thunk";


const initialState = {
  scoreCardData:{},
  loading: false,
  error: null,
};

const scoreCardSlice = createSlice({
  name: "scoreCard",
  initialState,
  extraReducers: (builder) => {
    builder
      // Fetch scoreCards
      .addCase(addScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(addScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  },
});


export default scoreCardSlice.reducer;
