import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Helper function to get the token from Redux state with centralized error handling
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
  toast.error(err.message);
  return rejectWithValue(err.message);
};

// Thunks with error handling, token management, and `say` parameter

// Fetch Groups by Class
export const fetchGroupsByClass = createAsyncThunk(
  "group/fetchGroupsByClass",
  async (classId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(`${baseUrl}/admin/group/${classId}?say=${say}`, {
        headers: { Authentication: token },
      });
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Groups by Class and Section
export const fetchGroupsByClassAndSection = createAsyncThunk(
  "group/fetchGroupsByClassAndSection",
  async ({ classId, sectionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/group/class/${classId}/section/${sectionId}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Sections by Class
export const fetchSectionsByClass = createAsyncThunk(
  "group/fetchSectionsByClass",
  async (classId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/getSectionByclass/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sections"
      );
    }
  }
);

// Fetch Unassigned Students
export const fetchUnassignedStudents = createAsyncThunk(
  "student/fetchUnassignedStudents",
  async (classId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.get(
        `${baseUrl}/admin/unassignedStudent/${classId}?say=${say}`,
        { headers: { Authentication: token } }
      );
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Group
export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (groupData, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.post(`${baseUrl}/admin/group?say=${say}`, groupData, {
        headers: { Authentication: token },
      });
      toast.success("Group added successfully!");
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Group
export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async ({ groupId, formData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say")
      const response = await axios.put(
        `${baseUrl}/admin/group/${groupId}?say=${say}`,
        formData,
        { headers: { Authentication: token } }
      );
      toast.success("Group updated successfully!");
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);



// Delete Group
export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (groupId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      await axios.delete(`${baseUrl}/admin/group/${groupId}?say=${say}`, {
        headers: { Authentication: token },
      });
      toast.success("Group deleted successfully!");
      return groupId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);


// // Fetch Sections by Class
// export const fetchSectionsByClass = createAsyncThunk(
//   "group/fetchSectionsByClass",
//   async (classId, { getState, rejectWithValue, dispatch }) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const response = await axios.get(
//         `${baseUrl}/admin/getSectionByclass/${classId}?say=${say}`,
//         { headers: { Authentication: token } }
//       );
//       return response.data.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// Create Section
export const createSection = createAsyncThunk(
  "section/createSection",
  async (sectionData, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(
        `${baseUrl}/admin/section?say=${say}`,
        sectionData,
        { headers: { Authentication: token } }
      );
      toast.success("Section created successfully!");
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Section
export const updateSection = createAsyncThunk(
  "section/updateSection",
  async ({ sectionId, sectionData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/editSection/${sectionId}?say=${say}`,
        sectionData,
        { headers: { Authentication: token } }
      );
      toast.success("Section updated successfully!");
      return response.data.section;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Section
export const deleteSection = createAsyncThunk(
  "section/deleteSection",
  async (sectionId, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      await axios.delete(`${baseUrl}/admin/section/${sectionId}?say=${say}`, {
        headers: { Authentication: token },
      });
      toast.success("Section deleted successfully!");
      return sectionId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Assign Student to Section
export const assignStudentToSection = createAsyncThunk(
  "student/assignStudentToSection",
  async ({ studentId, sectionId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.post(
        `${baseUrl}/admin/assignStudentToSection?say=${say}`,
        { studentId, sectionId },
        { headers: { Authentication: token } }
      );
      toast.success("Student assigned successfully!");
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Remove Student from Group
export const removeStudentFromGroup = createAsyncThunk(
  "student/removeStudentFromGroup",
  async ({ studentId, groupId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const response = await axios.put(
        `${baseUrl}/admin/delStudentFrmGroup?say=${say}`,
        { studentId, groupId },
        { headers: { Authentication: token } }
      );
      toast.success("Student removed from group successfully!");
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
