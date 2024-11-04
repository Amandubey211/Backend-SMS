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
        dispatch(setErrorMsg("Authentication Failed"));
        return rejectWithValue("Authentication Failed");
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

// Fetch all announcements by class ID
export const fetchAnnouncements = createAsyncThunk(
    "announcement/fetchAnnouncements",
    async (cid, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;

        try {
            const response = await axios.get(
                `${baseUrl}/admin/announcement/class/${cid}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            return response.data.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Mark an announcement as read
export const markAsReadAnnouncement = createAsyncThunk(
    "announcement/markAsReadAnnouncement",
    async (_id, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;

        try {
            await axios.post(
                `${baseUrl}/admin/markAsRead/announcement/${_id}?say=${say}`,
                {},
                {
                    headers: { Authentication: token },
                }
            );
            return _id;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Fetch a single announcement by ID
export const fetchAnnouncementById = createAsyncThunk(
    "announcement/fetchAnnouncementById",
    async (id, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;

        try {
            const response = await axios.get(
                `${baseUrl}/admin/announcement/${id}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            return response.data.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Delete an announcement by ID
export const deleteAnnouncement = createAsyncThunk(
    "announcement/deleteAnnouncement",
    async (id, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;

        try {
            await axios.delete(
                `${baseUrl}/admin/announcement/${id}?say=${say}`,
                {
                    headers: { Authentication: token },
                }
            );
            return id;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Create an announcement
export const createAnnouncement = createAsyncThunk(
    "announcement/createAnnouncement",
    async ({ data, files }, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;

        const formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));

        if (files && files.attachment) {
            formData.append("attachment", files.attachment);
        }

        try {
            const response = await axios.post(
                `${baseUrl}/admin/announcement?say=${say}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authentication: token,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Edit an announcement
export const editAnnouncement = createAsyncThunk(
    "announcement/editAnnouncement",
    async ({ id, data, files }, { getState, rejectWithValue, dispatch }) => {
        const token = getToken(getState(), rejectWithValue, dispatch);
        if (typeof token === "object") return token;

        const formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));

        if (files && files.attachment) {
            formData.append("attachment", files.attachment);
        }

        try {
            const response = await axios.put(
                `${baseUrl}/admin/announcement/${id}?say=${say}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authentication: token,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);
