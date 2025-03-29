// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createCategory, fetchCategory, updateCategory } from "./financeCategory.Thunk";



const initialState = {
  categories: [],
  loading: false,
  error: null,
  total:0,
  totalPages:1,
  page:1,
  totalRevenue:0,
 
};

const financeCategorySlice = createSlice({
  name: "financeCategory",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data || [];
        state.page = action.payload?.page ;
        state.total = action.payload?.total ;
        state.totalPages = action.payload?.totalPages;
        state.totalRevenue = action.payload?.totalRevenue ;
        
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

   
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
      
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default financeCategorySlice.reducer;
