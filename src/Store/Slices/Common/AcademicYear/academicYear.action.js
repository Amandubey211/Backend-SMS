import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import {
  setActiveAcademicYear,
  setSeletedAcademicYear,
} from "./academicYear.slice";
import axios from "axios";
import toast from "react-hot-toast";

export const fetchAcademicYear = createAsyncThunk(
  "user/AcademicYear",
  async (_, { rejectWithValue, dispatch, getState }) => {
    const token = getState().common.auth.token;

    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue(`Authentication failed!`);
    }
    const say = localStorage.getItem("say");
    try {
      dispatch(setShowError(false));

      const res = await axios.get(`${baseUrl}/admin/getAllAcademicYear`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      if (res.data.success) {
        const Ay = res.data?.data.find((i) => i._id == say);
        console.log("ayyyy", Ay);
        setSeletedAcademicYear(Ay);
      }
      return res?.data?.data;
    } catch (error) {
      console.log("Error in academic Year", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }
  }
);

export const updateAcademicYear = createAsyncThunk(
  "user/updateAcademicYear",
  async ({ id, data }, { rejectWithValue, dispatch, getState }) => {
    const token = getState().common.auth.token;

    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue(`Authentication failed!`);
    }

    try {
      dispatch(setShowError(false));

      const res = await axios.put(
        `${baseUrl}/admin/updateAcademicYear/${id}`,
        data,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Academic year updated successfully.");
      dispatch(fetchAcademicYear());
      return res?.data?.data;
    } catch (error) {
      console.log("Error in  update academic Year", error);
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }
  }
);
export const addAcademicYear = createAsyncThunk(
  "user/addAcademicYear",
  async (data, { rejectWithValue, dispatch, getState }) => {
    const token = getState().common.auth.token;

    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue(`Authentication failed!`);
    }

    try {
      dispatch(setShowError(false));

      const res = await axios.post(
        `${baseUrl}/admin/createAcademicYear`,
        data,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Academic year created successfully.");
      dispatch(fetchAcademicYear());
      return res?.data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }
  }
);
export const deleteAcademicYear = createAsyncThunk(
  "user/deleteAcademicYear",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const token = getState().common.auth.token;

    if (!token) {
      dispatch(setShowError(true));
      return rejectWithValue(`Authentication failed!`);
    }

    try {
      dispatch(setShowError(false));

      const res = await axios.delete(
        `${baseUrl}/admin/deleteAcademicYear/${id}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Academic year deleted successfully.");
      dispatch(fetchAcademicYear());
      return res?.data;
    } catch (error) {
      const err = ErrorMsg(error);
      dispatch(setShowError(true));
      return rejectWithValue(err.message);
    }
  }
);
