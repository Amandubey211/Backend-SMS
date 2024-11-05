import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { setActiveAcademicYear } from "./academicYear.slice";
import axios from "axios";

export const fetchAcademicYear = createAsyncThunk("user/AcademicYear",async(_,{ rejectWithValue, dispatch,getState })=>{
   
  const token = getState().common.auth.token;

    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue(`Authentication failed!`);
    }
      
    try {
      dispatch(setShowError(false));

      const res = await axios.get(`${baseUrl}/admin/getAllAcademicYear`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return res?.data?.data
    } catch (error) {
      console.log("Error in academic Year", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }

});

export const updateAcademicYear = createAsyncThunk("user/updateAcademicYear",async({id,data},{ rejectWithValue, dispatch,getState })=>{
   
  const token = getState().common.auth.token;

    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue(`Authentication failed!`);
    }
      
    try {
      dispatch(setShowError(false));

      const res = await axios.put(`${baseUrl}/admin/updateAcademicYear/${id}`,data, {
        headers: { Authentication: `Bearer ${token}` },
      });
      dispatch(fetchAcademicYear())
      return res?.data?.data
    } catch (error) {
      console.log("Error in  update academic Year", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }

});
