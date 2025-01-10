// rbacSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createRoleThunk,
  editRoleThunk,
  getAllRolesThunk,
  assignRoleThunk,
  deleteRoleThunk,
  getPermissionsThunk,
} from "./rbacThunks";

const initialState = {
  roles: [],
  permissions: [],
  loading: false,
  error: null,
};

const rbacSlice = createSlice({
  name: "rbac",
  initialState,
  reducers: {
    // Add synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Create Role
      .addCase(createRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.updatedRole) {
          state.roles.push(action.payload.updatedRole);
        }
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Role
      .addCase(editRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { roleId, updatedRole } = action.payload;
        const index = state.roles.findIndex((role) => role._id === roleId);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
      })
      .addCase(editRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Roles
      .addCase(getAllRolesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.roles = action.payload.data;
        }
      })
      .addCase(getAllRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign Role
      .addCase(assignRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRoleThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Update roles if necessary
      })
      .addCase(assignRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Role
      .addCase(deleteRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { roleId } = action.payload;
        state.roles = state.roles.filter((role) => role._id !== roleId);
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Permissions
      .addCase(getPermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.permissions = action.payload.data;
        }
      })
      .addCase(getPermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rbacSlice.reducer;
