import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { getAY } from "../../../../../Utils/academivYear";
import {
  postData,
  customRequest,
  deleteData,
  getData,
} from "../../../../../services/apiEndpoints";

export const fetchSyllabus = createAsyncThunk(
  "syllabus/fetchSyllabus",
  async ({ subjectId, classId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await getData(
        `/admin/syllabus/${subjectId}/class/${classId}`,
        {
          params: { say },
        }
      );

      if (response && response.status) {
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteSyllabus = createAsyncThunk(
  "syllabus/deleteSyllabus",
  async (syllabusId, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const response = await deleteData(`/admin/syllabus/${syllabusId}`, {
        params: { say },
      });

      if (response && response.status) {
        toast.success("Syllabus deleted successfully!");
        return syllabusId;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createSyllabus = createAsyncThunk(
  "syllabus/createSyllabus",
  async ({ title, content, subjectId }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const payload = { title, content, subjectId };
      const response = await postData("/admin/syllabus", payload, {
        params: { say },
      });

      if (response && response.status) {
        toast.success("Syllabus created successfully!");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editSyllabus = createAsyncThunk(
  "syllabus/editSyllabus",
  async ({ syllabusId, data, cid }, { rejectWithValue, dispatch }) => {
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const endpoint = `/admin/syllabus/${syllabusId}/class/${cid}`;
      const response = await customRequest(
        "put",
        endpoint,
        formData,
        {},
        {
          params: { say },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.status) {
        toast.success("Syllabus updated successfully!");
        return response.data;
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
