// src/store/finance/studentFees/studentFeesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createConfiguration, fetchConfiguration} from "./configuration.thunk";



const initialState = {
  configurations: [],
  loading: false,
  error: null,
  total:0,
  totalPages:1,
  page:1,
};

const financeConfigurationSlice = createSlice({
  name: "financeConfiguration",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = action.payload?.data || [];
        state.page = action.payload?.page ;
        state.total = action.payload?.total ;
        state.totalPages = action.payload?.totalPages;
        state.totalRevenue = action.payload?.totalRevenue ;
        
      })
      .addCase(fetchConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

   
    builder
      .addCase(createConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConfiguration.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      
  },
});

export default financeConfigurationSlice.reducer;
