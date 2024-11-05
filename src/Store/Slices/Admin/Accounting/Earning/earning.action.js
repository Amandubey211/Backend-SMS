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

export const fetchEarning = createAsyncThunk(
    "accounting/earning",
    async (_, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token; // Return if token is not retrieved

        try {
            const response = await axios.get(`${baseUrl}/admin/getearning?say=${say}`, {
                headers: { Authentication: token },
            });

            const data = response?.data?.earnings;
            console.log("data---", data);
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
);

export const fetchTotalAmounts = createAsyncThunk(
    "accounting/fetchtotalamounts",
    async (_, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.get(`${baseUrl}/admin/total_amount?say=${say}`, {
                headers: { Authentication: token },
            });

            return response?.data;

        } catch (error) {
            const errMsg = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(errMsg.message));
            return rejectWithValue(errMsg.message);
        }
    }
);

export const updateEarning = createAsyncThunk(
    "accounting/updateEarning",
    async ({ id, updatedEarning }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.put(`${baseUrl}/admin/updateEarning/${id}?say=${say}`, updatedEarning, {
                headers: { Authentication: token }
            });

            return response?.data;

        } catch (error) {
            const errMsg = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(errMsg.message));
            return rejectWithValue(errMsg.message);
        }
    }
);

export const createEarning = createAsyncThunk(
    "accounting/createEarning",
    async ({ payload }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.post(`${baseUrl}/admin/addEarning?say=${say}`, payload, {
                headers: { Authentication: token }
            });

            console.log("response of create", response);
            return response?.data;

        } catch (error) {
            const errMsg = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(errMsg.message));
            return rejectWithValue(errMsg.message);
        }
    }
);

export const deleteEarning = createAsyncThunk(
    "accounting/deleteEarning",
    async ({ id }, { rejectWithValue, getState, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === 'object') return token;

        try {
            const response = await axios.delete(`${baseUrl}/admin/deleteEarning/${id}?say=${say}`, {
                headers: { Authentication: token }
            });

            console.log("response of delete", response);
            return response?.data;

        } catch (error) {
            const errMsg = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(errMsg.message));
            return rejectWithValue(errMsg.message);
        }
    }
);
