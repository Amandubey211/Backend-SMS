import { createSlice } from "@reduxjs/toolkit";
import { getAllRoutes, getRouteById } from "./routes.action";

const initialState = {
  loading: false,
  error: false,
  transportRoutes: [],
  singleRoute: {},  
};

const transportRouteSlice = createSlice({
  name: "transportRoute",  
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllRoutes.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.transportRoutes = action.payload?.data || [];
      })
      .addCase(getAllRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      .addCase(getRouteById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getRouteById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleRoute = action.payload?.data || {}; 
      })
      .addCase(getRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const {} = transportRouteSlice.actions;
export default transportRouteSlice.reducer;
