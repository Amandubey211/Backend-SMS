import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";

const say = localStorage.getItem("say");

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

// Fetch Student Fees
export const fetchFees = createAsyncThunk(
    "accounting/studentFees",
    async (_, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.get(`${baseUrl}/admin/get_fees?say=${say}`, {
                headers: { Authentication: token },
            });

            return response?.data?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Fetch Classes
export const fetchClasses = createAsyncThunk(
    "accounting/fetchClasses",
    async (_, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.get(`${baseUrl}/admin/class?say=${say}`, {
                headers: { Authentication: token },
            });

            return response?.data?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Delete Student Fee
export const deleteStudentFee = createAsyncThunk(
    "accounting/deleteStudentFee",
    async (feeId, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.delete(`${baseUrl}/admin/fee/delete/${feeId}?say=${say}`, {
                headers: { Authentication: token },
            });

            return response?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Create Student Fee
export const createStudentFee = createAsyncThunk(
    "accounting/createStudentFee",
    async ({ submissionData }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.post(`${baseUrl}/admin/student/create_fees?say=${say}`, submissionData, {
                headers: { Authentication: token },
            });

            return response?.data?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Update Student Fee
export const updateStudentFee = createAsyncThunk(
    "accounting/updateStudentFee",
    async ({ feeId, submissionData }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.put(`${baseUrl}/admin/student/update_fees/${feeId}?say=${say}`, submissionData, {
                headers: { Authentication: token },
            });

            return response?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);
