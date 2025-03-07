// import { createAsyncThunk } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, getData, postData, putData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";

// import { setShowError } from "../../Common/Alerts/alertsSlice";
// import { handleError } from "../../Common/Alerts/errorhandling.action";
// import { getAY } from "../../../../Utils/academivYear";
// import {
//   getData,
//   postData,
//   putData,
//   deleteData,
// } from "../../../../services/apiEndpoints";
// import { getUserRole } from "../../../../Utils/getRoles";

// // Fetch Timetables
// export const fetchTimetables = createAsyncThunk(
//   "timetable/fetchTimetables",
//   async (filters = {}, { rejectWithValue, getState, dispatch }) => {
//     const { role } = getState().common.auth;
//     let updatedFilters = { ...filters };

//     // If role is student or teacher, include classId from state
//     if (role === "student" || role === "teacher") {
//       const { userDetails } = getState().common.user;
//       const classId = userDetails?.classId;
//       if (classId) {
//         updatedFilters = { ...updatedFilters, classId };
//       }
//     }

//     // Add semesterId from state
//     const semesterId = getState().common.user.classInfo.selectedSemester.id;
//     if (semesterId) {
//       updatedFilters = { ...updatedFilters, semesterId };
//     }

//     try {
//       const say = getAY();
//       const getRole = getUserRole(getState);
//       dispatch(setShowError(false));
//       const response = await getData(
//         `/${getRole}/timetable?say=${say}`,
//         updatedFilters
//       );
//       return response?.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Create Timetable
// export const createTimetable = createAsyncThunk(
//   "timetable/createTimetable",
//   async (data, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const semesterId = getState().common.user.classInfo.selectedSemester.id;
//       // Merge semesterId into the request body
//       data = { ...data, semesterId };
//       const say = getAY();
//       const getRole = getUserRole(getState);
//       dispatch(setShowError(false));
//       const response = await postData(
//         `/${getRole}/create-timetable?say=${say}`,
//         data
//       );
//       return response?.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Update Timetable
// export const updateTimetable = createAsyncThunk(
//   "timetable/updateTimetable",
//   async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const semesterId = getState().common.user.classInfo.selectedSemester.id;
//       // Merge semesterId into the request body
//       data = { ...data, semesterId };
//       const say = getAY();
//       const getRole = getUserRole(getState);
//       dispatch(setShowError(false));
//       const response = await putData(
//         `/${getRole}/update-timetable/${id}?say=${say}`,
//         data
//       );
//       return response?.data;
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );

// // Delete Timetable
// export const deleteTimetable = createAsyncThunk(
//   "timetable/deleteTimetable",
//   async (id, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const say = getAY();
//       const getRole = getUserRole(getState);
//       dispatch(setShowError(false));
//       await deleteData(`/${getRole}/delete-timetable/${id}?say=${say}`);
//       return { id };
//     } catch (error) {
//       return handleError(error, dispatch, rejectWithValue);
//     }
//   }
// );



export const createTimetable = createAsyncThunk(
  'create/timetable',
  async (data, { rejectWithValue, getState, dispatch }) => {
    
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const res=await postData(`${getRole}/create-timetable`,data);
      console.log("timetable create data:->",res);
      return res.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }

  }
)


export const fetchTimetableList = createAsyncThunk(
  'fetch/timetable',
  async (_, { rejectWithValue, getState, dispatch }) => {
    
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const res=await getData(`${getRole}/timetable`);
       return res?.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }

  }
)


export const updateTimetable = createAsyncThunk(
  'update/timetable',
  async (data, { rejectWithValue, getState, dispatch }) => {
    
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const res=await putData(`${getRole}/timetable`,data);
      console.log("timetable create data:->",res);
      return res.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }

  }
)



export const deleteTimetable = createAsyncThunk(
  'delete/timetable',
  async (data, { rejectWithValue, getState, dispatch }) => {
    
    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false));
      const res=await deleteData(`${getRole}/timetable`,data);
      console.log("timetable create data:->",res);
      return res.data;
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }

  }
)
