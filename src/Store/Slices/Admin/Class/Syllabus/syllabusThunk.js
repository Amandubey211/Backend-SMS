import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
  const err = ErrorMsg(error);
  dispatch(setShowError(true));
  dispatch(setErrorMsg(err.message));
  return rejectWithValue(err.message);
};

// Fetch Syllabus Thunk
export const fetchSyllabus = createAsyncThunk(
  "syllabus/fetchSyllabus",
  async ({ subjectId, classId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.get(
        `${baseUrl}/admin/syllabus/${subjectId}/class/${classId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );
      return response.data.data;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

// Delete Syllabus Thunk
export const deleteSyllabus = createAsyncThunk(
  "syllabus/deleteSyllabus",
  async (syllabusId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.delete(
        `${baseUrl}/admin/syllabus/${syllabusId}?say=${say}`,
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Syllabus deleted successfully!");
      return syllabusId;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

// Create Syllabus Thunk
export const createSyllabus = createAsyncThunk(
  "syllabus/createSyllabus",
  async ({ title, content, subjectId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(
        `${baseUrl}/admin/syllabus?say=${say}`,
        { title, content, subjectId },
        {
          headers: { Authentication: token },
        }
      );
      toast.success("Syllabus created successfully!");
      return response.data.data;
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);

// Edit Syllabus Thunk
export const editSyllabus = createAsyncThunk(
  "syllabus/editSyllabus",
  async ({ syllabusId, data, cid }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await axios.put(
        `${baseUrl}/admin/syllabus/${syllabusId}/class/${cid}?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      if (response.data.status) {
        toast.success("Syllabus updated successfully!");
        return response.data.data;
      } else {
        throw new Error("Failed to update syllabus");
      }
    } catch (err) {
      return handleError(err, dispatch, rejectWithValue);
    }
  }
);
