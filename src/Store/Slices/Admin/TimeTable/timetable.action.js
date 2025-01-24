import { createAsyncThunk } from "@reduxjs/toolkit";

import { setShowError } from "../../Common/Alerts/alertsSlice";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../Utils/academivYear";
import { getData, postData, putData, deleteData } from "../../../../services/apiEndpoints";
import { getUserRole } from "../../../../Utils/getRoles";

// Fetch Timetables
export const fetchTimetables = createAsyncThunk(
  "timetable/fetchTimetables",
  async (filters = {}, { rejectWithValue, getState, dispatch }) => {
    const { role } = getState().common.auth;
   

    let updatedFilters = { ...filters };

    // If role is student, include classId from localStorage
    if (role === "student" || role === "teacher") {
      const {userDetails} = getState((store) => store.common.user);
      const classId = userDetails?.classId
      if (classId) {
        updatedFilters = { ...updatedFilters, classId };
      }
    }

    try {
      const say = getAY();
      const getRole = getUserRole(getState);
      dispatch(setShowError(false))
      const response = await getData(`/${getRole}/timetable?say=${say}`, updatedFilters);

      // Ensure you're accessing the correct data property
      return response?.data; // Accessing the nested data property
    } catch (error) {

        return handleError(error, dispatch, rejectWithValue);
    }
  }
);


// Create Timetable
export const createTimetable = createAsyncThunk(
  "timetable/createTimetable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    

    try {
      const say = getAY(); 
      const getRole = getUserRole(getState);
      dispatch(setShowError(false)); // Explicitly reset error visibility
      const response = await postData(`/${getRole}/create-timetable?say=${say}`, data); // Use postData from apiEndpoints
      return response?.data; // Directly returning the response
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Use centralized error handling
    }
  }
);

// Update Timetable
export const updateTimetable = createAsyncThunk(
  "timetable/updateTimetable",
  async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
    

    try {
      const say = getAY(); 
      const getRole = getUserRole(getState);
      dispatch(setShowError(false)); // Explicitly reset error visibility
      const response = await putData(`/${getRole}/update-timetable/${id}?say=${say}`, data); // Use putData from apiEndpoints
      return response?.data; // Access the nested data property using optional chaining
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Use centralized error handling
    }
  }
);

// Delete Timetable
export const deleteTimetable = createAsyncThunk(
  "timetable/deleteTimetable",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY(); 
      const getRole = getUserRole(getState);
      dispatch(setShowError(false)); // Explicitly reset error visibility
      await deleteData(`/${getRole}/delete-timetable/${id}?say=${say}`); // Use deleteData from apiEndpoints
      return { id }; // Returning ID of the deleted timetable
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue); // Use centralized error handling
    }
  }
);
