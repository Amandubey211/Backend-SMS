import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchAllTeachers } from "../../Class/Teachers/teacherThunks";
import { setAllStaffs } from "./staffSlice";
import { createStaffSalary } from "../../Accounting/Expenses/expenses.action";
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { deleteData, getData, postData, putData } from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";


// Fetch All Staff
export const fetchAllStaff = createAsyncThunk(
  "user/allStaff",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const response = await getData(`/admin/get_staffs?say=${say}`);
      dispatch(setAllStaffs(response));
      return response;
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
      const say = getAY();
      dispatch(setShowError(false));
      const formData = new FormData();
      Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
      formData.append("address", JSON.stringify(address));

      const response = await postData(`/admin/staff_register?say=${say}`, formData);

      if (response.success) {
        toast.success("User added successfully");

        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.message);
      }

        if(userData.role == 'teacher'){
          dispatch(fetchAllTeachers())
        }else{
          dispatch(fetchAllStaff())
        }
        dispatch(createStaffSalary({status:"unpaid",action:"pay now"}));
        return response;
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
      const say = getAY();
      dispatch(setShowError(false));
      const formData = new FormData();
      Object.keys(userData).forEach((key) => formData.append(key, userData[key]));
      formData.append("address", JSON.stringify(address));

      const response = await putData(`${baseUrl}/admin/update_staff/${id}?say=${say}`, formData);

      if (response.success) {
        toast.success("User updated successfully");
        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.message);
      }

      return response;
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
      dispatch(setShowError(false));
      const say = getAY();
      const response = await deleteData(`${baseUrl}/admin/delete_staff/${userData.id}?say=${say}`);

      if (response.success) {
        toast.success("User deactivated successfully");
        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.message || "User deactivation failed");
      }

      return response;
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
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(`${baseUrl}/admin/update_active_status?say=${say}`, userData);

      if (response.success) {
        toast.success("User activated successfully");
        userData.role === 'teacher' ? dispatch(fetchAllTeachers()) : dispatch(fetchAllStaff());
      } else {
        toast.error(response.message || "User activation failed");
      }

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
