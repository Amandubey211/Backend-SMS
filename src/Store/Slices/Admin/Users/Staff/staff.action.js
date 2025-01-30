import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchAllTeachers } from "../../Class/Teachers/teacherThunks";
import { setAllStaffs } from "./staffSlice";
import { createStaffSalary } from "../../Accounting/Expenses/expenses.action";
import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import {
  customRequest,
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";
import { getUserRole } from "../../../../../Utils/getRoles";

// Fetch All Staff
export const fetchAllStaff = createAsyncThunk(
  "user/allStaff",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      dispatch(setShowError(false));
      const getRole = getUserRole(getState);
      const response = await getData(`/${getRole}/get_staffs?say=${say}`);
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const formData = new FormData();
      Object.keys(userData).forEach((key) =>
        formData.append(key, userData[key])
      );
      formData.append("address", JSON.stringify(address));

      const response = await customRequest(
        "post",
        `/${getRole}/staff_register?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response.success) {
        toast.success("User added successfully");

        userData.role === "teacher"
          ? dispatch(fetchAllTeachers())
          : dispatch(fetchAllStaff());
      } else {
        toast.error(response.message);
      }

      if (userData.role == "teacher") {
        dispatch(fetchAllTeachers());
      } else {
        dispatch(fetchAllStaff());
      }
      dispatch(createStaffSalary({ status: "unpaid", action: "pay now" }));
      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Edit User
export const editUser = createAsyncThunk(
  "user/editUser",
  async (
    { userData, address, id },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const formData = new FormData();
      Object.keys(userData).forEach((key) =>
        formData.append(key, userData[key])
      );
      formData.append("address", JSON.stringify(address));

      const response = await customRequest(
        "put",
        `/${getRole}/update_staff/${id}?say=${say}`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response.success) {
        userData.role === "teacher"
          ? dispatch(fetchAllTeachers())
          : dispatch(fetchAllStaff());
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await deleteData(
        `/${getRole}/delete_staff/${userData.id}?say=${say}`
      );

      if (response.success) {
        toast.success("User deactivated successfully");
        userData.role === "teacher"
          ? dispatch(fetchAllTeachers())
          : dispatch(fetchAllStaff());
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
      const getRole = getUserRole(getState);
      const say = getAY();
      const response = await putData(
        `/${getRole}/update_active_status?say=${say}`,
        userData
      );

      if (response.success) {
        toast.success("User activated successfully");
        userData.role === "teacher"
          ? dispatch(fetchAllTeachers())
          : dispatch(fetchAllStaff());
      } else {
        toast.error(response.message || "User activation failed");
      }

      return response;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
