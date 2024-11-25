import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { setActiveAcademicYear, setSeletedAcademicYear } from "./academicYear.slice";
import axios from "axios";
import toast from "react-hot-toast";
import { deleteData, getData, postData, putData } from "../../../../services/apiEndpoints";

export const fetchAcademicYear = createAsyncThunk("user/AcademicYear", async (_, { rejectWithValue, dispatch, getState }) => {



  try {
    dispatch(setShowError(false));
    const say = localStorage.getItem('say')
    const res = await getData(`/admin/getAllAcademicYear`);
    if (res.success) {
      const Ay = res?.data.find((i) => i._id == say);
      setSeletedAcademicYear(Ay)
    }
    return res?.data
  } catch (error) {
    return handleError(error, dispatch, rejectWithValue);
  }

});

export const updateAcademicYear = createAsyncThunk("user/updateAcademicYear", async ({ id, data }, { rejectWithValue, dispatch, getState }) => {

  try {
    dispatch(setShowError(false));

    const res = await putData(`/admin/updateAcademicYear/${id}`, data);
    toast.success("Academic year updated successfully.");
    dispatch(fetchAcademicYear())
    return res?.data
  } catch (error) {
    return handleError(error, dispatch, rejectWithValue);
  }

});

export const addAcademicYear = createAsyncThunk("user/addAcademicYear", async (data, { rejectWithValue, dispatch, getState }) => {
  try {
    dispatch(setShowError(false));

    const res = await postData(`/admin/createAcademicYear`, data);
    toast.success("Academic year created successfully.");
    dispatch(fetchAcademicYear())
    return res
  } catch (error) {

    return handleError(error, dispatch, rejectWithValue);
  }

});
export const deleteAcademicYear = createAsyncThunk("user/deleteAcademicYear", async (id, { rejectWithValue, dispatch, getState }) => {

  try {
    dispatch(setShowError(false));
    const res = await deleteData(`/admin/deleteAcademicYear/${id}`);
    toast.success("Academic year deleted successfully.");
    dispatch(fetchAcademicYear())
    return res
  } catch (error) {
    return handleError(error, dispatch, rejectWithValue);
  }

});