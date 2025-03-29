import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getData, postData, putData } from "../../../../services/apiEndpoints";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";

import Cookies from "js-cookie";

import { setLocalCookies } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
export const fetchBranch = createAsyncThunk(
  "user/Branch",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const res = await getData(`/admin/getAllBranches`);
      return res?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateBranch = createAsyncThunk(
  "user/updateBranch",
  async ({ navigate, data }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const res = await postData(`/admin/selectBranch`, data);

      Cookies.remove("say");
      if (res?.data?.isAcademicYearActive) {
        setLocalCookies("say", res?.data?.academicYear?._id);

        setLocalCookies("logo", data?.logo);
        
        navigate("/dashboard");
      } else {
        Cookies.remove("isAcademicYearActive");
        navigate("/create_academicYear");
      }
      return res?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const updateBranchInfo = createAsyncThunk(
  "user/updateBranchInfo",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setShowError(false));
      const res = await putData(
        `/student_diwan/update_school/${data.id}`,
        data
      );
      toast.success("Branch updated successfully.");
      dispatch(fetchBranch());
      return res?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
