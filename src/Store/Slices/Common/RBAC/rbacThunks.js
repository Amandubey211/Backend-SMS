import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postData,
  deleteData,
  getData,
  putData,
} from "../../../../services/apiEndpoints";
import { setShowError } from "../Alerts/alertsSlice";
import { getAY } from "../../../../Utils/academivYear";
import { handleError } from "../Alerts/errorhandling.action";

export const createRoleThunk = createAsyncThunk(
  "rbac/createRole",
  async (
    { name, description, permission = [] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const say = getAY(); // Assuming getAY() is defined somewhere in your code
      dispatch(setShowError(false));
      // Now we send name, description, department, and permission
      const response = await postData(`/admin/role/create?say=${say}`, {
        name,
        description,
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
      const say = getAY();
      dispatch(setShowError(false));
      const response = await putData(
        `/admin/role/edit/${roleId}?say=${say}`,
        updates
      );
      return { roleId, ...response };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
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
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
