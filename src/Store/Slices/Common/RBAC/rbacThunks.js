import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postData,
  deleteData,
  getData,
  putData,
} from "../../../../services/apiEndpoints";
import { setErrorMsg, setShowError } from "../Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear";
import { handleError } from "../Alerts/errorhandling.action";
import { setPermissions } from "../Auth/reducers/authSlice";

export const createRoleThunk = createAsyncThunk(
  "rbac/createRole",
  async (
    { name, description, department, permission = [] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const say = getAY(); // Assuming getAY() is defined somewhere in your code
      dispatch(setShowError(false));
      // Now we send name, description, department, and permission
      const response = await postData(`/admin/role/create?say=${say}`, {
        name,
        description,
        department,
        permission,
      });
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editRoleThunk = createAsyncThunk(
  "rbac/editRole",
  async ({ roleId, updates }, { rejectWithValue, dispatch }) => {
    try {
      // Generate the 'say' parameter for the request
      const say = getAY();
      dispatch(setShowError(false));

      // Send PUT request to the backend
      const response = await putData(
        `/admin/role/edit/${roleId}?say=${say}`,
        updates
      );
      dispatch(getAllRolesThunk());

      // Validate and return the updated role data
      return {
        roleId,
        updatedRole: response.data,
        message: response.message || "Role updated successfully",
      };
    } catch (error) {
      // Handle any errors encountered during the request
      return rejectWithValue(handleError(error, dispatch, rejectWithValue));
    }
  }
);

export const getAllRolesThunk = createAsyncThunk(
  "rbac/getAllRoles",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/role/all?say=${say}`);
      console.log("roles", response);
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const assignRoleThunk = createAsyncThunk(
  "rbac/assignRole",
  async ({ staffId, roleId, permission }, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await postData(`/admin/role/assignRole?say=${say}`, {
        staffId,
        roleId,
        permission,
      });
      return { staffId, ...response };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteRoleThunk = createAsyncThunk(
  "rbac/deleteRole",
  async (roleId, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await deleteData(
        `/admin/role/delete/${roleId}?say=${say}`
      );
      dispatch(getAllRolesThunk());
      return { roleId, ...response };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const getPermissionsThunk = createAsyncThunk(
  "rbac/getPermissions",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/permission?say=${say}`);

      console.log(response, "ddddd");
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Thunk to fetch and normalize permissions
export const getMyRolePermissionsThunk = createAsyncThunk(
  "rbac/getMyRolePermissions",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const say = getAY(); // Retrieve the 'say' parameter
      dispatch(setShowError(false)); // Reset any previous error states

      // Make a GET request to fetch the user's role permissions
      const response = await getData(`/admin/mypermission?say=${say}`);

      if (!response || !response.success) {
        const errorMessage =
          response?.message || "Failed to fetch permissions.";
        dispatch(setErrorMsg(errorMessage));
        return rejectWithValue(errorMessage);
      }

      const data = response.data;
      const role = getState().common.auth.role;

      if (!role) {
        const errorMessage = "User role is not defined.";
        dispatch(setErrorMsg(errorMessage));
        return rejectWithValue(errorMessage);
      }

      // Find the permissions for the user's department
      const departmentPermission = data.find(
        (dept) => dept.department.toLowerCase() === role.toLowerCase()
      );

      if (!departmentPermission) {
        const errorMessage = "No permissions found for your department.";
        dispatch(setErrorMsg(errorMessage));
        return rejectWithValue(errorMessage);
      }

      // Extract route names into a Set for uniqueness
      const permissionsSet = new Set();
      departmentPermission.groups.forEach((group) => {
        group.routes.forEach((route) => {
          permissionsSet.add(route.name);
        });
      });

      const permissions = Array.from(permissionsSet);

      // Dispatch the normalized permissions to the AuthSlice
      dispatch(setPermissions(permissions));

      console.log("Permissions fetched and set:", permissions);

      return permissions;
    } catch (error) {
      console.error("Error in getMyRolePermissionsThunk:", error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
