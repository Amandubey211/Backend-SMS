
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { fetchAllTeachers } from "../../Class/Teachers/teacherThunks";
import { setAllStaffs } from "./staffSlice";

export const fetchAllStaff = createAsyncThunk(
  "user/allStaff",
  async (_, { rejectWithValue, getState,dispatch }) => {
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.get(`${baseUrl}/admin/get_staffs`, {
        headers: { Authentication: `Bearer ${token}` },
      });
    dispatch(setAllStaffs(response.data))
      return response.data;

    } catch (error) {
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async ({userData, address}, { rejectWithValue, getState,dispatch }) => {
   
    const { common } = getState();
    const token = common.auth.token;
    console.log(userData, address);
    
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
      });
      formData.append("address", JSON.stringify(address));
      const response = await axios.post(`${baseUrl}/admin/staff_register`,formData, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if(response.data.success){
        toast.success("User added successfully");
        if(userData.role == 'teacher'){
          dispatch(fetchAllTeachers())
        }else{
          dispatch(fetchAllStaff())
        }
        return response.data;
      }else{
        toast.error(response.data.message );
      }
  
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message||"Something is wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const editUser = createAsyncThunk(
  "user/editUser",
  async ({userData, address,id}, { rejectWithValue, getState,dispatch }) => {
   
    const { common } = getState();
    const token = common.auth.token;
    console.log(userData, address);
    
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
      });
      formData.append("address", JSON.stringify(address));
      const response = await axios.put(`${baseUrl}/admin/update_staff/${id}`,formData, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if(response.data.success){
        toast.success("User update successfully");
        if(userData.role == 'teacher'){
          dispatch(fetchAllTeachers())
        }else{
          dispatch(fetchAllStaff())
        }
        return response.data;
      }else{
        toast.error(response.data.message );
      }
  
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message||"Something is wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deactiveUser = createAsyncThunk(
  "user/deactiveUser",
  async (userData, { rejectWithValue, getState,dispatch }) => {
   
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.delete(`${baseUrl}/admin/delete_staff/${userData.id}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if(response.data.success){
        toast.success("User deactivated successfully");
        if(userData.role == 'teacher'){
          dispatch(fetchAllTeachers())
        }else{
          dispatch(fetchAllStaff())
        }
        return response.data;
      }else{
        toast.error(response.data.message||"User deactivated failed" );
      }
  
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message||"Something is wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const activeUser = createAsyncThunk(
  "user/activeUser",
  async (userData, { rejectWithValue, getState,dispatch }) => {
   
    const { common } = getState();
    const token = common.auth.token;
    try {
      const response = await axios.put(`${baseUrl}/admin/update_active_status`,userData, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if(response.data.success){
        toast.success("User activated successfully");
        if(userData.role == 'teacher'){
          dispatch(fetchAllTeachers())
        }else{
          dispatch(fetchAllStaff())
        }
        return response.data;
      }else{
        toast.error(response.data.message||"User activated failed" );
      }
  
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message||"Something is wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);