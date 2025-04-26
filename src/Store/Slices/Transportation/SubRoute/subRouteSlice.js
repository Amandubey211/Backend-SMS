import { createSlice } from "@reduxjs/toolkit";
import { createSubRoute, deleteSubRoute, getSubRouteById, getSubRoutesBySchool, updateSubRoute } from "./subRoute.action";


const initialState = {
  loading: false,
  error: false,
  subRoutes: [],
  selectedSubRoute: null,
  currentPage: 1,
  totalPages: 1,
};

const subRouteSlice = createSlice({
  name: "subRoute",
  initialState,
  reducers: {
    resetSelectedSubRoute(state) {
      state.selectedSubRoute = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get SubRoutes By School
      .addCase(getSubRoutesBySchool.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getSubRoutesBySchool.fulfilled, (state, action) => {
        state.loading = false;
        state.subRoutes = action.payload?.data || [];
        state.currentPage = action.payload?.currentPage || 1;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getSubRoutesBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Get SubRoute by ID
      .addCase(getSubRouteById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getSubRouteById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubRoute = action.payload?.data || null;
      })
      .addCase(getSubRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Create SubRoute
      .addCase(createSubRoute.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createSubRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.subRoutes.push(action.payload?.data);
      })
      .addCase(createSubRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Update SubRoute
      .addCase(updateSubRoute.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateSubRoute.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        const index = state.subRoutes.findIndex(s => s._id === updated._id);
        if (index !== -1) {
          state.subRoutes[index] = updated;
        }
      })
      .addCase(updateSubRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      })

      // Delete SubRoute
      .addCase(deleteSubRoute.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteSubRoute.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.subRoutes = state.subRoutes.filter(s => s._id !== deletedId);
      })
      .addCase(deleteSubRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || true;
      });
  },
});

export const { resetSelectedSubRoute } = subRouteSlice.actions;
export default subRouteSlice.reducer;
