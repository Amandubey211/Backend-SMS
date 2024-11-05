import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { setUserDetails } from "../reducers/userSlice";

// Fetch user data
export const fetchUserData = createAsyncThunk(
  "User/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

// Fetch class data
export const fetchClassData = createAsyncThunk(
  "User/fetchClassData",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/class/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch class data"
      );
    }
  }
);

// Fetch subject data
export const fetchSubjectData = createAsyncThunk(
  "User/fetchSubjectData",
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subject data"
      );
    }
  }
);

export const updatePasswordThunk = createAsyncThunk("User/updatePassword",
  async(data,{rejectWithValue,getState})=>{
  const { common } = getState();
  const token = common.auth.token;
  try {
    const response = await axios.put(`${baseUrl}/api/password/change-password`,data, {
      headers: { Authentication: `Bearer ${token}` },
    });
    toast.success('Password update successfully')
    return response.data;
  } catch (error) {
    toast.error('current password is wrong')
    return rejectWithValue(error.response?.data || error.message);
  }

})

export const updateAdminProfile = createAsyncThunk ("User/updateAdmin",
  async({data},{rejectWithValue,getState,dispatch})=>{
  const { common } = getState();
  const token = common.auth.token;
    try {
      const response = await axios.put(`${baseUrl}/admin/update/admin_profile`,data, {
        headers: { Authentication: `Bearer ${token}` },
      });
      toast.success('Profile update successfully');
      if(response.data.success){
        dispatch(setUserDetails(response.data.data))
      } 
      return response.data;
    } catch (error) {
      toast.error('Profile not updated')
      return rejectWithValue(error.response?.data || error.message);
    }
  }
  )

