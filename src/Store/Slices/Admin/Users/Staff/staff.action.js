import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchAllTeachers } from "../../Class/Teachers/teacherThunks";
import { setAllStaffs } from "./staffSlice";
import { createStaffSalary } from "../../Accounting/Expenses/expenses.action";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from the Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};




// Fetch All Staff
export const fetchAllStaff = createAsyncThunk(
  "user/allStaff",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(`${baseUrl}/admin/get_staffs?say=${say}`, {
        headers: { Authentication: token },
      });
      dispatch(setAllStaffs(response.data));
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Add User
export const addUser = createAsyncThunk(
  "user/addUser",
  async ({ userData, address }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const formData = new FormData();
      Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
      formData.append("address", JSON.stringify(address));

      const response = await axios.post(`${baseUrl}/admin/staff_register?say=${say}`, formData, {
        headers: { Authentication: token },
      });

      if (response.data.success) {
        toast.success("User added successfully");

        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.data.message);
      }

        if(userData.role == 'teacher'){
          dispatch(fetchAllTeachers())
        }else{
          dispatch(fetchAllStaff())
        }
        dispatch(createStaffSalary({status:"unpaid",action:"pay now"}));
        return response.data;
      }else{
        toast.error(response.data.message );
      }

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


// Edit User
export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ userData, address, id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const formData = new FormData();
      Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
      formData.append("address", JSON.stringify(address));

      const response = await axios.put(`${baseUrl}/admin/update_staff/${id}?say=${say}`, formData, {
        headers: { Authentication: token },
      });

      if (response.data.success) {
        toast.success("User updated successfully");
        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.data.message);
      }

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Deactivate User
export const deactiveUser = createAsyncThunk(
  "user/deactiveUser",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.delete(`${baseUrl}/admin/delete_staff/${userData.id}?say=${say}`, {
        headers: { Authentication: token },
      });

      if (response.data.success) {
        toast.success("User deactivated successfully");
        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.data.message || "User deactivation failed");
      }

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


// Activate User

export const activeUser = createAsyncThunk(
  "user/activeUser",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(`${baseUrl}/admin/update_active_status?say=${say}`, userData, {
        headers: { Authentication: token },
      });

      if (response.data.success) {
        toast.success("User activated successfully");
        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.data.message || "User activation failed");
      }

      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
