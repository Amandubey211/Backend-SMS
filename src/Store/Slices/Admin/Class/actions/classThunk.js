import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

// Helper function to retrieve token and handle errors if token is missing
const getToken = (state, rejectWithValue, dispatch) => {
    const token = state.common.auth?.token;
    if (!token) {
        dispatch(setShowError(true));
        dispatch(setErrorMsg('Authentication Failed'));
        return rejectWithValue('Authentication Failed');
    }
    return `Bearer ${token}`;
};

// Centralized error handling
const handleError = (error, dispatch, rejectWithValue) => {
    const err = ErrorMsg(error);
    dispatch(setShowError(true));
    dispatch(setErrorMsg(err.message));
    return rejectWithValue(err.message);
};

// Fetch all classes
export const fetchAllClasses = createAsyncThunk(
    "class/fetchAllClasses",
    async (_, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.get(`${baseUrl}/admin/class?say=${say}`, {
                headers: { Authentication: token },
            });
            return response.data.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Fetch class details
export const fetchClassDetails = createAsyncThunk(
    "class/fetchClassDetails",
    async (classId, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.get(`${baseUrl}/admin/class/${classId}?say=${say}`, {
                headers: { Authentication: token },
            });
            return response.data?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Create a new class
export const createClass = createAsyncThunk(
    "class/createClass",
    async (classData, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.post(`${baseUrl}/admin/class?say=${say}`, classData, {
                headers: { Authentication: token },
            });
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Update an existing class
export const updateClass = createAsyncThunk(
    "class/updateClass",
    async ({ classData, classId }, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.put(`${baseUrl}/admin/update_class/${classId}?say=${say}`, classData, {
                headers: { Authentication: token },
            });
            return response.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Delete a class
export const deleteClass = createAsyncThunk(
    "class/deleteClass",
    async (classId, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            await axios.delete(`${baseUrl}/admin/delete_class/${classId}?say=${say}`, {
                headers: { Authentication: token },
            });
            return classId;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);
