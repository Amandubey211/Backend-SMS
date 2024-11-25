import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import {
  putData,
  getData,
  deleteData,
  customRequest,
} from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";

// const say = localStorage.getItem("say");

// // Helper function to get the token from Redux state with centralized error handling
const getToken = (state, rejectWithValue, dispatch) => {
  const token = state.common.auth?.token;
  if (!token) {
    dispatch(setShowError(true));
    dispatch(setErrorMsg("Authentication Failed"));
    return rejectWithValue("Authentication Failed");
  }
  return `Bearer ${token}`;
};

// // Centralized error handling
// const handleError = (error, dispatch, rejectWithValue) => {
//   const err = ErrorMsg(error);
//   dispatch(setShowError(true));
//   dispatch(setErrorMsg(err.message));
//   return rejectWithValue(err.message);
// };

// // Fetch Modules Thunk
// export const fetchModules = createAsyncThunk(
//   "module/fetchModules",
//   async ({ cid, sid }, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const response = await axios.get(
//         `${baseUrl}/admin/student/classes/${cid}/modules/${sid}?say=${say}`,
//         {
//           headers: { Authentication: token },
//         }
//       );
//       return response.data.data.modules;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Add Module Thunk
// export const addModule = createAsyncThunk(
//   "module/addModule",
//   async (
//     { name, thumbnail, subjectId },
//     { rejectWithValue, getState, dispatch }
//   ) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const cid = getState().common.user.classInfo.selectedClassId;
//       const sid = getState().common.user.subjectInfo.selectedSubjectId;

//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("subjectId", subjectId);
//       if (thumbnail) formData.append("thumbnail", thumbnail);

//       const response = await axios.post(
//         `${baseUrl}/admin/add_module?say=${say}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authentication: token,
//           },
//         }
//       );

//       toast.success("Module added successfully");
//       if (response.data.success) {
//         dispatch(fetchModules({ cid, sid }));
//       }
//       return response.data.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Edit Module Thunk
// export const editModule = createAsyncThunk(
//   "module/editModule",
//   async (
//     { moduleId, name, thumbnail, subjectId },
//     { rejectWithValue, getState, dispatch }
//   ) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const cid = getState().common.user.classInfo.selectedClassId;
//       const sid = getState().common.user.subjectInfo.selectedSubjectId;

//       const formData = new FormData();
//       formData.append("name", name);
//       if (thumbnail) formData.append("thumbnail", thumbnail);

//       const response = await axios.put(
//         `${baseUrl}/admin/subjects/${subjectId}/modules/${moduleId}?say=${say}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authentication: token,
//           },
//         }
//       );

//       toast.success("Module updated successfully");
//       if (response.data.success) {
//         dispatch(fetchModules({ cid, sid }));
//       }
//       return response.data.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Delete Module Thunk
// export const deleteModule = createAsyncThunk(
//   "module/deleteModule",
//   async ({ sid, moduleId }, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       await axios.delete(
//         `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}?say=${say}`,
//         {
//           headers: { Authentication: token },
//         }
//       );

//       toast.success("Module deleted successfully");
//       return moduleId;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Move Module Thunk
// export const moveModule = createAsyncThunk(
//   "module/moveModule",
//   async (
//     { moduleId, newIndex, sid },
//     { rejectWithValue, getState, dispatch }
//   ) => {
//     try {
//       const token = getToken(getState(), rejectWithValue, dispatch);
//       const say = localStorage.getItem("say");
//       const response = await axios.put(
//         `${baseUrl}/admin/subjects/${sid}/modules/reorder?say=${say}`,
//         { moduleId, newIndex },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authentication: token,
//           },
//         }
//       );

//       toast.success("Module moved successfully");
//       return response.data.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// thunks/moduleThunks.js

export const fetchModules = createAsyncThunk(
  "module/fetchModules",
  async ({ cid, sid }, { rejectWithValue, dispatch }) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      // API Call using service function with query parameter
      const response = await getData(
        `/admin/student/classes/${cid}/modules/${sid}`,
        { say }
      );

      // Check if response is valid and indicates success
      if (response && response.success) {
        // Assuming 'modules' are nested within 'data.data'
        return response.data.modules;
      } else {
        // If response is undefined or success is false, throw an error to be caught
        throw new Error(response?.message || "Failed to fetch modules.");
      }
    } catch (error) {
      // Handle Errors
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

// export const addModule = createAsyncThunk(
//   "module/addModule",
//   async (
//     { name, thumbnail, subjectId },
//     { rejectWithValue, dispatch, getState }
//   ) => {
//     // Mandatory Lines
//     const say = getAY();
//     dispatch(setShowError(false));

//     try {
//       const cid = getState().common.user.classInfo.selectedClassId;
//       const sid = getState().common.user.subjectInfo.selectedSubjectId;

//       // Construct FormData for multipart/form-data
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("subjectId", subjectId);
//       if (thumbnail) formData.append("thumbnail", thumbnail);

//       // API Call using customRequest for multipart/form-data with query parameter
//       const endpoint = "/admin/add_module";
//       const response = await customRequest("post", endpoint, formData, {
//         params: { say },
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Check if response is valid and indicates success
//       if (response && response.success) {
//         toast.success("Module added successfully");
//         // Refresh the modules list
//         dispatch(fetchModules({ cid, sid }));
//         return response.data; // Assuming 'data' contains the new module
//       } else {
//         throw new Error(response?.message || "Failed to add module.");
//       }
//     } catch (error) {
//       // Handle Errors
//       console.error(error);
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// Add Module Thunk

export const addModule = createAsyncThunk(
  "module/addModule",
  async (
    { name, thumbnail, subjectId },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getToken(getState(), rejectWithValue, dispatch);
      const say = localStorage.getItem("say");
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("subjectId", subjectId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await axios.post(
        `${baseUrl}/admin/add_module?say=${say}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authentication: token,
          },
        }
      );

      toast.success("Module added successfully");
      if (response.data.success) {
        dispatch(fetchModules({ cid, sid }));
      }
      return response.data.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const editModule = createAsyncThunk(
  "module/editModule",
  async (
    { moduleId, name, thumbnail, subjectId },
    { rejectWithValue, dispatch, getState }
  ) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      const cid = getState().common.user.classInfo.selectedClassId;
      const sid = getState().common.user.subjectInfo.selectedSubjectId;

      // Construct FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", name);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      // API Call using customRequest for multipart/form-data with query parameter
      const endpoint = `/admin/subjects/${subjectId}/modules/${moduleId}`;
      const response = await customRequest("put", endpoint, formData, {
        params: { say },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if response is valid and indicates success
      if (response && response.success) {
        toast.success("Module updated successfully");
        // Refresh the modules list
        dispatch(fetchModules({ cid, sid }));
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to edit module.");
      }
    } catch (error) {
      // Handle Errors
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const deleteModule = createAsyncThunk(
  "module/deleteModule",
  async ({ sid, moduleId }, { rejectWithValue, dispatch }) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      // API Call using service function with query parameter
      const endpoint = `/admin/subjects/${sid}/modules/${moduleId}`;
      const response = await deleteData(endpoint, { say });

      // Check if response is valid and indicates success
      if (response && response.success) {
        toast.success("Module deleted successfully");
        return moduleId;
      } else {
        throw new Error(response?.message || "Failed to delete module.");
      }
    } catch (error) {
      // Handle Errors
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

export const moveModule = createAsyncThunk(
  "module/moveModule",
  async ({ moduleId, newIndex, sid }, { rejectWithValue, dispatch }) => {
    // Mandatory Lines
    const say = getAY();
    dispatch(setShowError(false));

    try {
      // API Call using service function with query parameter
      const endpoint = `/admin/subjects/${sid}/modules/reorder`;
      const data = { moduleId, newIndex };
      const response = await putData(endpoint, data, { say });

      // Check if response is valid and indicates success
      if (response && response.success) {
        toast.success("Module moved successfully");
        return response.data; // not getting from the backend
      } else {
        throw new Error(response?.message || "Failed to move module.");
      }
    } catch (error) {
      // Handle Errors
      console.error(error);
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
