import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setUserDetails } from "../reducers/userSlice";
import { customRequest, getData, putData } from "../../../../../services/apiEndpoints";
import { handleError } from "../../Alerts/errorhandling.action";
import { setShowError } from "../../Alerts/alertsSlice";


// Fetch user data
export const fetchUserData = createAsyncThunk(
  "User/fetchUserData",
  async (userId, { rejectWithValue,dispatch }) => {
    try {
    
      dispatch(setShowError(false));
      const response = await getData(`/user/${userId}`);
      return response;
    } catch (error) {
      return handleError(error,dispatch,rejectWithValue)
    }
  }
);

// Fetch class data
export const fetchClassData = createAsyncThunk(
  "User/fetchClassData",
  async (classId, { rejectWithValue,dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(`/class/${classId}`);
      return response;
    } catch (error) {
      return handleError(error,dispatch,rejectWithValue)
    }
  }
);

// Fetch subject data
export const fetchSubjectData = createAsyncThunk(
  "User/fetchSubjectData",
  async (subjectId, { rejectWithValue,dispatch }) => {
    try {
      dispatch(setShowError(false));
      const response = await getData(`/subject/${subjectId}`);
      return response;
    } catch (error) {
      return handleError(error,dispatch,rejectWithValue)
    }
  }
);

export const updatePasswordThunk = createAsyncThunk("User/updatePassword",
  async(data,{rejectWithValue,dispatch})=>{
  try {
    dispatch(setShowError(false));
    const response = await putData(`/api/password/change-password`,data);
    toast.success('Password update successfully')
    return response;
  } catch (error) {
    return handleError(error,dispatch,rejectWithValue)
  }

})

export const updateAdminProfile = createAsyncThunk ("User/updateAdmin",
  async({data},{rejectWithValue,dispatch})=>{
    try {
      dispatch(setShowError(false));
      const response = await customRequest('put',`/admin/update/admin_profile`,data, 
        {"Content-Type": "multipart/form-data"}
      );
      toast.success('Profile update successfully');
      if(response?.success){
        dispatch(setUserDetails(response?.data))
      } 
      return response;
    } catch (error) {
      toast.error('Profile not updated')
      return handleError(error,dispatch,rejectWithValue)
    }
  }
  )
export const updateSchoolLogo = createAsyncThunk ("User/updateSchoolLogo",
  async(data,{rejectWithValue,dispatch})=>{
    try {
      dispatch(setShowError(false));
      const response = await customRequest('put',`/student_diwan/update_school/${data.schoolId}`,data, 
        {"Content-Type": "multipart/form-data"}
      );
      return response;
    } catch (error) {
      toast.error('Something is wrong')
      return handleError(error,dispatch,rejectWithValue)
    }
  }
  )

