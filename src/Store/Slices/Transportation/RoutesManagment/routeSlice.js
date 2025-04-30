/* Path: features/Transportation/RoutesManagment/transportRouteSlice.js */
import { createSlice } from "@reduxjs/toolkit";
import {
  createRoute,
  getRoutesBySchool,
  getRouteById,
  updateRoute,
  deleteRoute, // ⬅️ new
} from "./routes.action";

const initialState = {
  loading: false,
  error: null,
  transportRoutes: [],
  singleRoute: {},
};

const slice = createSlice({
  name: "transportRoute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || true;
    };

    /* list */
    builder
      .addCase(getRoutesBySchool.pending, pending)
      .addCase(getRoutesBySchool.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.transportRoutes = payload?.data || [];
      })
      .addCase(getRoutesBySchool.rejected, rejected);

    /* single */
    builder
      .addCase(getRouteById.pending, pending)
      .addCase(getRouteById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleRoute = payload?.data || {};
      })
      .addCase(getRouteById.rejected, rejected);

    /* create */
    builder
      .addCase(createRoute.pending, pending)
      .addCase(createRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        // if (payload?.data) state.transportRoutes.unshift(payload.data);
      })
      .addCase(createRoute.rejected, rejected);

    /* update */
    builder
      .addCase(updateRoute.pending, pending)
      .addCase(updateRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        // const updated = payload?.data;
        // const idx = state.transportRoutes.findIndex(
        //   (r) => r._id === updated._id
        // );
        // if (idx !== -1) state.transportRoutes[idx] = updated;
        // if (state.singleRoute?._id === updated._id) state.singleRoute = updated;
      })
      .addCase(updateRoute.rejected, rejected);

    /* delete */
    builder
      .addCase(deleteRoute.pending, pending)
      .addCase(deleteRoute.fulfilled, (state, { meta }) => {
        state.loading = false;
        const id = meta.arg; // id passed to thunk
        // state.transportRoutes = state.transportRoutes.filter(
        //   (r) => r._id !== id
        // );
        // if (state.singleRoute?._id === id) state.singleRoute = {};
      })
      .addCase(deleteRoute.rejected, rejected);
  },
});

export default slice.reducer;
