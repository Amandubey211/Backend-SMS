// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createInventory, fetchInventory, fetchLowInventory, updateInventory } from "./inventory.thunk";



const initialState = {
  inventories: [],
  loading: false,
  error: null,
  total:0,
  totalPages:1,
  page:1,
  totalRevenue:0,
  otherData:{},

  
  lowStock:{
  inventories: [],
  loading: false,
  error: null,
  total:0,
  totalPages:1,
  page:1,
  totalRevenue:0,
  },

};

const financeInventorySlice = createSlice({
  name: "financeInventory",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload?.data || [];
        state.page = action.payload?.page ;
        state.total = action.payload?.total ;
        state.totalPages = action.payload?.totalPages;
        state.totalRevenue = action.payload?.totalRevenue ;
        state.otherData = action.payload?.otherData;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
    builder
      .addCase(fetchLowInventory.pending, (state) => {
        state.lowStock.loading = true;
        state.lowStock.error = null;
      })
      .addCase(fetchLowInventory.fulfilled, (state, action) => {
        state.lowStock.loading = false;
        state.lowStock.inventories = action.payload?.data || [];
        state.lowStock.page = action.payload?.page ;
        state.lowStock.total = action.payload?.total ;
        state.lowStock.totalPages = action.payload?.totalPages;
        state.lowStock.totalRevenue = action.payload?.totalRevenue;
      })
      .addCase(fetchLowInventory.rejected, (state, action) => {
        state.lowStock.loading = false;
        state.lowStock.error = action.payload || action.error.message;
      });

   
    builder
      .addCase(createInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      
    builder
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false;
      
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default financeInventorySlice.reducer;
