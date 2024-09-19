import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { setGroupsList } from "./groupSectionSlice"; // Ensure this path is correct

// Fetch Groups by Class
export const fetchGroupsByClass = createAsyncThunk(
  "group/fetchGroupsByClass",
  async (classId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(`${baseUrl}/admin/group/${classId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch groups";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Groups by Class and Section (Thunk)
export const fetchGroupsByClassAndSection = createAsyncThunk(
  "group/fetchGroupsByClassAndSection",
  async ({ classId, sectionId }, { getState, rejectWithValue, dispatch }) => {
    const token = getState().common.auth.token; // Get token from Redux store

    try {
      const response = await axios.get(
        `${baseUrl}/admin/group/class/${classId}/section/${sectionId}`,
        {
          headers: { Authentication: `Bearer ${token}` }, // Use token from Redux
        }
      );

      if (response.data.status) {
        dispatch(setGroupsList(response.data.data));
        return response.data.data;
      } else {
        // toast.error("Failed to fetch groups. Please try again.");
        return rejectWithValue("Failed to fetch groups");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch groups";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Sections by Class
export const fetchSectionsByClass = createAsyncThunk(
  "group/fetchSectionsByClass",
  async (classId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/getSectionByclass/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch sections";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Unassigned Students
export const fetchUnassignedStudents = createAsyncThunk(
  "student/fetchUnassignedStudents",
  async (classId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.get(
        `${baseUrl}/admin/unassignedStudent/${classId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch unassigned students";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Create Group
export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (groupData, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.post(`${baseUrl}/admin/group`, groupData, {
        headers: { Authentication: `Bearer ${token}` },
      });
      toast.success("Group added successfully!");
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create group";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Group
export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async ({ groupId, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/group/${groupId}`,
        formData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Group updated successfully!");
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update group";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Group
export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (groupId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.delete(`${baseUrl}/admin/group/${groupId}`, {
        headers: { Authentication: `Bearer ${token}` },
      });
      toast.success("Group deleted successfully!");
      return groupId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete group";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Create Section
export const createSection = createAsyncThunk(
  "section/createSection",
  async (sectionData, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.post(
        `${baseUrl}/admin/section`,
        sectionData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Section created successfully!");
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create section";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Section
export const updateSection = createAsyncThunk(
  "section/updateSection",
  async ({ sectionId, sectionData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/editSection/${sectionId}`,
        sectionData,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Section updated successfully!");
      return response.data.section;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update section";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Section
export const deleteSection = createAsyncThunk(
  "section/deleteSection",
  async (sectionId, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.delete(
        `${baseUrl}/admin/section/${sectionId}`,
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Section deleted successfully!");
      return sectionId;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete section";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Assign Student to Section
export const assignStudentToSection = createAsyncThunk(
  "student/assignStudentToSection",
  async ({ studentId, sectionId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.post(
        `${baseUrl}/admin/assignStudentToSection`,
        { studentId, sectionId },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Student assigned to section successfully!");
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to assign student to section";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove Student from Group
export const removeStudentFromGroup = createAsyncThunk(
  "student/removeStudentFromGroup",
  async ({ studentId, groupId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().common.auth.token;
      const response = await axios.put(
        `${baseUrl}/admin/delStudentFrmGroup`,
        { studentId, groupId },
        {
          headers: { Authentication: `Bearer ${token}` },
        }
      );
      toast.success("Student removed from group successfully!");
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove student from group";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
