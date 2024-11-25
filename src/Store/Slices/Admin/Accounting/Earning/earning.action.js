import { createAsyncThunk } from "@reduxjs/toolkit";
import { setErrorMsg, setShowError } from "../../../Common/Alerts/alertsSlice";
import { ErrorMsg, handleError } from "../../../Common/Alerts/errorhandling.action";
import { deleteData, getData, postData, putData } from "../../../../../services/apiEndpoints";
import { getAY } from "../../../../../Utils/academivYear";

export const fetchEarning = createAsyncThunk(
    "accounting/earning",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await getData(`/admin/getearning?say=${say}`);
            const data = response?.earnings;
            console.log("data---", data);
            return data;

        } catch (error) {
            handleError(error, dispatch, rejectWithValue)
        }
    }
);

export const fetchTotalAmounts = createAsyncThunk(
    "accounting/fetchtotalamounts",
    async (_, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await getData(`/admin/total_amount?say=${say}`);
            console.log("response", response);

            return response;

        } catch (error) {
            handleError(error, dispatch, rejectWithValue)
        }
    }
);

export const updateEarning = createAsyncThunk(
    "accounting/updateEarning",
    async ({ id, updatedEarning }, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await putData(`/admin/updateEarning/${id}?say=${say}`, updatedEarning);

            return response?.data;

        } catch (error) {
            handleError(error, dispatch, rejectWithValue)
        }
    }
);

export const createEarning = createAsyncThunk(
    "accounting/createEarning",
    async ({ payload }, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await postData(`/admin/addEarning?say=${say}`, payload);

            console.log("response of create", response);
            return response?.data;

        } catch (error) {
            handleError(error, dispatch, rejectWithValue)
        }
    }
);

export const deleteEarning = createAsyncThunk(
    "accounting/deleteEarning",
    async ({ id }, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await deleteData(`/admin/deleteEarning/${id}?say=${say}`);

            //console.log("response of delete", response);
            return response?.data;

        } catch (error) {
            handleError(error, dispatch, rejectWithValue)
        }
    }
);
