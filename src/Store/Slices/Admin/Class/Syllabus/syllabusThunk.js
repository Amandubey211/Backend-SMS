import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

// Fetch Syllabus Thunk
export const fetchSyllabus = createAsyncThunk(
  "syllabus/fetchSyllabus",
  async ({ subjectId, classId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/syllabus/${subjectId}/class/${classId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch syllabus";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete Syllabus Thunk
export const deleteSyllabus = createAsyncThunk(
  "syllabus/deleteSyllabus",
  async (syllabusId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.delete(
        `${baseUrl}/admin/syllabus/${syllabusId}`,
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      toast.success("Syllabus deleted successfully!");
      return syllabusId; // Return the deleted syllabus ID to update state
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete syllabus";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Create Syllabus Thunk
export const createSyllabus = createAsyncThunk(
  "syllabus/createSyllabus",
  async ({ title, content, subjectId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.post(
        `${baseUrl}/admin/syllabus`,
        { title, content, subjectId },
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      toast.success("Syllabus created successfully!");
      return response.data.data; // Return the new syllabus data
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create syllabus";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Edit Syllabus Thunke
export const editSyllabus = createAsyncThunk(
  "syllabus/editSyllabus",
  async ({ syllabusId, data, cid }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token; // Fetch the token from the global state
      const formData = new FormData();

      // Append all keys and values from the `data` object to FormData
      for (const key in data) {
        formData.append(key, data[key]);
      }

      // Make the PUT request to the API with FormData
      const response = await axios.put(
        `${baseUrl}/admin/syllabus/${syllabusId}/class/${cid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: `Bearer ${token}`, // Send the token as Bearer token
          },
        }
      );

      if (response.data.status) {
        toast.success("Syllabus updated successfully!");
        return response.data.data; // Return the updated syllabus data
      } else {
        toast.error("Failed to update syllabus");
        return rejectWithValue("Failed to update syllabus");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update syllabus";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
