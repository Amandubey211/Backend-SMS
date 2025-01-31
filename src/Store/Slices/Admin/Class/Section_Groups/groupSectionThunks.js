import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setShowError, setErrorMsg } from "../../../Common/Alerts/alertsSlice";
import {
  ErrorMsg,
  handleError,
} from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";

// Fetch Groups by Class
export const fetchGroupsByClass = createAsyncThunk(
  "group/fetchGroupsByClass",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`/${getRole}/group/${classId}?say=${say}`);
      return response.data;
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
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/group/class/${classId}/section/${sectionId}?say=${say}`
      );
      console.log(response.data, "dddd");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Sections by Class
export const fetchSectionsByClass = createAsyncThunk(
  "group/fetchSectionsByClass",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/getSectionByclass/${classId}?say=${say}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
export const fetchSectionsNamesByClass = createAsyncThunk(
  "group/fetchSectionsNamesByClass",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/admin/all/getSectionByclass/${classId}?say=${say}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Unassigned Students
export const fetchUnassignedStudents = createAsyncThunk(
  "student/fetchUnassignedStudents",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/unassignedStudent/${classId}?say=${say}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Group
export const createGroup = createAsyncThunk(
  "group/createGroup",
  async (groupData, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await postData(
        `/${getRole}/group?say=${say}`,
        groupData
      );
      toast.success("Group added successfully!");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Group
export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async ({ groupId, formData }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/${getRole}/group/${groupId}?say=${say}`,
        formData
      );
      toast.success("Group updated successfully!");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Group
export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (groupId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      await deleteData(`/${getRole}/group/${groupId}?say=${say}`);
      toast.success("Group deleted successfully!");
      return groupId;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const createSection = createAsyncThunk(
  "section/createSection",
  async (sectionData, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await postData(
        `/${getRole}/section?say=${say}`,
        sectionData
      );
      toast.success("Section created successfully!");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Update Section
export const updateSection = createAsyncThunk(
  "section/updateSection",
  async (
    { sectionId, sectionData },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/${getRole}/editSection/${sectionId}?say=${say}`,
        sectionData
      );
      toast.success("Section updated successfully!");
      return response.section;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Delete Section
export const deleteSection = createAsyncThunk(
  "section/deleteSection",
  async (sectionId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      await deleteData(`/${getRole}/section/${sectionId}?say=${say}`);
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
  async ({ studentId, sectionId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await postData(
        `/${getRole}/assignStudentToSection?say=${say}`,
        { studentId, sectionId }
      );
      toast.success("Student assigned successfully!");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Remove Student from Group
export const removeStudentFromGroup = createAsyncThunk(
  "student/removeStudentFromGroup",
  async ({ studentId, groupId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await putData(
        `/${getRole}/delStudentFrmGroup?say=${say}`,
        { studentId, groupId }
      );
      toast.success("Student removed from group successfully!");
      return response.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
