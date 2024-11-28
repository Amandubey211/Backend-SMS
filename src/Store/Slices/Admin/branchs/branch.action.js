import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import Cookies from 'js-cookie'
import { fetchAcademicYear } from "../../Common/AcademicYear/academicYear.action";
import { redirect } from "react-router-dom";
import { setLocalCookies } from "../../../../Utils/academivYear";
export const fetchBranch = createAsyncThunk("user/Branch", async (_, { rejectWithValue, dispatch,getState, }) => {
  try {
    dispatch(setShowError(false));
    const res = await getData(`/admin/getAllBranches`);
    return res?.data
  } catch (error) {
    return handleError(error, dispatch, rejectWithValue);
  }

});

export const updateBranch = createAsyncThunk("user/updateBranch", async ({navigate,data}, { rejectWithValue, dispatch }) => {

  try {
    dispatch(setShowError(false));
    const res = await postData(`/admin/selectBranch`, data);
    toast.success("Branch updated successfully.");
    Cookies.remove('say');
    if (res?.data?.isAcademicYearActive) {
        setLocalCookies("say", res?.data?.academicYear?._id);
        }else{
            navigate('/create_academicYear')
        }
    return res?.data
  } catch (error) {
    return handleError(error, dispatch, rejectWithValue);
  }

});
