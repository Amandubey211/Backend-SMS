import { deleteData, postData, putData } from "../../../../services/apiEndpoints";
import { getAY } from "../../../../Utils/academivYear";
import { getUserRole } from "../../../../Utils/getRoles";
import { handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDriverList = createAsyncThunk(
    "transport/fetchDriverList",
    async ({ rejectWithValue, getState, dispatch }) => {
        try {
            const say = getAY();
            const role = getUserRole(getState);

            dispatch(setShowError(false));

            const response = await postData(`/${role}/transport/get-drivers?say=${say}`);
            return response;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

export const addDriver = createAsyncThunk(
    "transport/addDriver",
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            const say = getAY();
            const role = getUserRole(getState);

            dispatch(setShowError(false));

            const response = await postData(`/${role}/transport/create-driver?say=${say}`, data);
            return response;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

export const updateDriver = createAsyncThunk(
    "transport/updateDriver",
    async ({ id, data }, { rejectWithValue, getState, dispatch }) => {
        try {
            const say = getAY();
            const role = getUserRole(getState);

            dispatch(setShowError(false));

            const response = await putData(`/${role}/transport/update-driver/${id}?say=${say}`, data);
            return response;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteDriver = createAsyncThunk(
    "transport/deleteDriver",
    async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const say = getAY();
            const role = getUserRole(getState);

            dispatch(setShowError(false));

            const response = await deleteData(`/${role}/transport/delete-driver/${id}?say=${say}`);
            return response;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);