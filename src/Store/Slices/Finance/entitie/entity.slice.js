// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createEntity, fetchEntity, updateEntity } from "./entity.thunk";



const initialState = {
  entities: [],
  loading: false,
  error: null,
  total:0,
  totalPages:1,
  page:1,
  totalRevenue:0,
};

const entitySlice = createSlice({
  name: "financeEntity",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload?.data || [];
        state.page = action.payload?.page ;
        state.total = action.payload?.total ;
        state.totalPages = action.payload?.totalPages;
      })
      .addCase(fetchEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

   
    builder
      .addCase(createEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntity.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      
    builder
      .addCase(updateEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntity.fulfilled, (state, action) => {
        state.loading = false;
      
      })
      .addCase(updateEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default entitySlice.reducer;
