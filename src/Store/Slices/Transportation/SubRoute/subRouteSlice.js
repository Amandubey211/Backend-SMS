/* Path unchanged: features/transportation/SubRoute/subRouteSlice.js */
import { createSlice } from "@reduxjs/toolkit";
import {
  createSubRoute,
  deleteSubRoute,
  getSubRouteById,
  getSubRoutesBySchool,
  updateSubRoute,
} from "./subRoute.action";

const initialState = {
  loading: false,
  error: null,
  subRoutes: [],
  selectedSubRoute: null,
};

const subRouteSlice = createSlice({
  name: "transportSubRoute",
  initialState,
  reducers: {
    resetSelectedSubRoute(state) {
      state.selectedSubRoute = null;
    },
  },
  extraReducers: (builder) => {
    /* helpers */
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
      .addCase(getSubRoutesBySchool.pending, pending)
      .addCase(getSubRoutesBySchool.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.subRoutes = payload?.data || [];
      })
      .addCase(getSubRoutesBySchool.rejected, rejected);

    /* single */
    builder
      .addCase(getSubRouteById.pending, pending)
      .addCase(getSubRouteById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedSubRoute = payload?.data || null;
      })
      .addCase(getSubRouteById.rejected, rejected);

    /* create */
    builder
      .addCase(createSubRoute.pending, pending)
      .addCase(createSubRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        // if (payload?.data) state.subRoutes.push(payload.data);
      })
      .addCase(createSubRoute.rejected, rejected);

    /* update */
    builder
      .addCase(updateSubRoute.pending, pending)
      .addCase(updateSubRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        // const updated = payload?.data;
        // const idx = state.subRoutes.findIndex((s) => s._id === updated._id);
        // if (idx !== -1) state.subRoutes[idx] = updated;
        // if (state.selectedSubRoute?._id === updated._id)
        //   state.selectedSubRoute = updated;
      })
      .addCase(updateSubRoute.rejected, rejected);

    /* delete */
    builder
      .addCase(deleteSubRoute.pending, pending)
      .addCase(deleteSubRoute.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.subRoutes = state.subRoutes.filter((s) => s._id !== payload.id);
      })
      .addCase(deleteSubRoute.rejected, rejected);
  },
});

export const { resetSelectedSubRoute } = subRouteSlice.actions;
export default subRouteSlice.reducer;
