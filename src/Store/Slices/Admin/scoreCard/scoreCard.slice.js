import { createSlice } from "@reduxjs/toolkit";
import { addScoreCard,getScoreCard, updateScoreCard,addCommonDataToScoreCard, reomoveCommonDataFromScoreCard } from "./scoreCard.thunk";


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
      // add scoreCards
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
  // Fetch scoreCards 
      .addCase(getScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  // update scoreCards 
      .addCase(updateScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(updateScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  // Add commonData to  scoreCards 
      .addCase(addCommonDataToScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommonDataToScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(addCommonDataToScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  // remove commonData from  scoreCards 
      .addCase(reomoveCommonDataFromScoreCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reomoveCommonDataFromScoreCard.fulfilled, (state, action) => {
        state.scoreCardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(reomoveCommonDataFromScoreCard.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
  },
});


export default scoreCardSlice.reducer;
