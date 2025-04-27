/* Path unchanged: features/Transportation/RoutesManagment/transportRouteSlice.js */
import { createSlice } from '@reduxjs/toolkit';
import {
  createRoute,
  getRoutesBySchool,
  getRouteById,
  updateRoute,
} from './routes.action';

const initialState = {
  loading: false,
  error: null,
  transportRoutes: [],
  singleRoute: {},
};

const transportRouteSlice = createSlice({
  name: 'transportRoute',
  initialState,
  reducers: {},
  extraReducers: builder => {
    const pending = state => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || true;
    };

    /* 🔹 LIST */
    builder
      .addCase(getRoutesBySchool.pending, pending)
      .addCase(getRoutesBySchool.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.transportRoutes = payload?.data || [];
      })
      .addCase(getRoutesBySchool.rejected, rejected);

    /* 🔹 SINGLE */
    builder
      .addCase(getRouteById.pending, pending)
      .addCase(getRouteById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleRoute = payload?.data || {};
      })
      .addCase(getRouteById.rejected, rejected);

    /* 🔹 CREATE */
    builder
      .addCase(createRoute.pending, pending)
      .addCase(createRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.data) state.transportRoutes.unshift(payload.data);
      })
      .addCase(createRoute.rejected, rejected);

    /* 🔹 UPDATE */
    builder
      .addCase(updateRoute.pending, pending)
      .addCase(updateRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        const updated = payload?.data;
        const idx = state.transportRoutes.findIndex(r => r._id === updated._id);
        if (idx !== -1) state.transportRoutes[idx] = updated;
        if (state.singleRoute?._id === updated._id) state.singleRoute = updated;
      })
      .addCase(updateRoute.rejected, rejected);
  },
});

export default transportRouteSlice.reducer;
