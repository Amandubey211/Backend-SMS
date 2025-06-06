import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../../services/apiEndpoints";
import { getUserRole } from "../../../../../Utils/getRoles";
import { fetchStudentsByClassAndSection } from "../Students/studentThunks";

// Fetch Groups by Class
export const fetchGroupsByClass = createAsyncThunk(
  "group/fetchGroupsByClass",
  async (classId, { rejectWithValue, dispatch, getState }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(`/${getRole}/group/${classId}?say=${say}`);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
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
      if (response.status) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

  // fetch by student Id
export const fetchGroupsByStudent = createAsyncThunk(
  "group/fetchGroupsByStudent",
  async ({studentId}, { getState, rejectWithValue, dispatch }) => {
    try {
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const say = getAY();
      const response = await getData(
        `/${getRole}/group/student/${studentId}?say=${say}`
      );
      if (response?.status) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
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

      if (response.status) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Fetch Sections Names by Class
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
      if (response.status) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
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

      if (response.status) {
        return response.data;
      }
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

      if (response.status) {
        toast.success("Group added successfully!");
        dispatch(fetchGroupsByClass(groupData.classId));
        return response?.data?.classId?._id;
      } else {
        toast.error(response.message || "Failed to add group.");
        return rejectWithValue(response);
      }
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

      if (response.message == "Group updated successfully") {
        toast.success("Group updated successfully!");
        return response.data;
      } else {
        toast.error(response.message || "Failed to update group.");
        return rejectWithValue(response);
      }
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
      const cid = getState().common.user.classInfo.selectedClassId;
      const response = await deleteData(
        `/${getRole}/group/${groupId}?say=${say}`
      );

      if (response.status) {
        toast.success("Group deleted successfully!");
        dispatch(fetchGroupsByClass(cid));
        return groupId;
      } else {
        toast.error(response.message || "Failed to delete group.");
        return rejectWithValue(response);
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// Create Section
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

      if (response.status) {
        toast.success("Section created successfully!");
        return response.data;
      } else {
        toast.error(response.message || "Failed to create section.");
        return rejectWithValue(response);
      }
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

      if (response.success) {
        toast.success("Section updated successfully!");

        return response.section || response.data || sectionId;
      } else {
        toast.error(response.message || "Failed to update section.");
        return rejectWithValue(response);
      }
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
      const response = await deleteData(
        `/${getRole}/section/${sectionId}?say=${say}`
      );

      if (response.status) {
        toast.success("Section deleted successfully!");
        return sectionId;
      } else {
        toast.error(response.message || "Failed to delete section.");
        return rejectWithValue(response);
      }
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
      const classId = getState().common.user.classInfo.selectedClassId;
      dispatch(setShowError(false));
      const say = getAY();
      const response = await postData(
        `/${getRole}/assignStudentToSection?say=${say}`,
        { studentId, sectionId }
      );

      if (response.success) {
        toast.success("Student assigned successfully!");
        dispatch(fetchStudentsByClassAndSection(classId));
        return response.data;
      } else {
        toast.error(response.message || "Failed to assign student.");
        return rejectWithValue(response);
      }
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

      if (response.status) {
        toast.success("Student removed from group successfully!");
        return response.data;
      } else {
        toast.error(response.message || "Failed to remove student.");
        return rejectWithValue(response);
      }
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
