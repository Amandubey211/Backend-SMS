import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";

/**
 * Fetch the timetable list from the server.
 * Accepts optional filters object to include in the query if needed (e.g. classId, type, status).
 */
export const fetchTimetableList = createAsyncThunk(
  "timetable/fetchTimetableList",
  async (filters = {}, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);

      // Example: If you have custom filters, you can attach them as query params.
      // e.g., ?classId=xxx&type=xxx etc. Currently this is just a demonstration.
      // Construct a query string from filters if needed. For now, we pass them as an object.
      dispatch(setShowError(false));

      const response = await getData(`/${role}/timetable?say=${say}`, filters);
      return response?.data; // This should be the array of timetables
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Create a new timetable.
 * `data` is the form object to create the timetable.
 */
export const createTimetable = createAsyncThunk(
  "timetable/createTimetable",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));

      // POST /create-timetable?say=...
      const res = await postData(`/${role}/create-timetable?say=${say}`, data);
      return res.data; // newly created timetable object
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Update an existing timetable.
 * `payload` = { id, data } — where id is the timetable ID and data are the updated fields.
 */
export const updateTimetable = createAsyncThunk(
  "timetable/updateTimetable",
  async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));

      // PUT /update-timetable/:id?say=...
      const res = await putData(
        `/${role}/update-timetable/${id}?say=${say}`,
        data
      );
      dispatch(fetchTimetableList());
      return res.data; // updated timetable object
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);

/**
 * Delete an existing timetable by ID.
 * `id` is the timetable ID.
 */
export const deleteTimetable = createAsyncThunk(
  "timetable/deleteTimetable",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const say = getAY();
      const role = getUserRole(getState);
      dispatch(setShowError(false));

      // DELETE /delete-timetable/:id?say=...
      await deleteData(`/${role}/delete-timetable/${id}?say=${say}`);

      // Return the deleted ID so we can remove it from the state
      return { id };
    } catch (error) {
      return handleError(error, dispatch, rejectWithValue);
    }
  }
);
