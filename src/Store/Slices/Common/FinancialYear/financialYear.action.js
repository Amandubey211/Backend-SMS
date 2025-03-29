import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorMsg, handleError } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";
import toast from "react-hot-toast";
import { getData, postData, putData } from "../../../../services/apiEndpoints";

export const fetchFinancialYear = createAsyncThunk("user/FinancialYear", async (_, { rejectWithValue, dispatch }) => {


    try {
        dispatch(setShowError(false));
        const res = await getData(`/admin/getFinancialYear`);
        return res?.data
    } catch (error) {
        return handleError(error, dispatch, rejectWithValue);
    }

});

export const updateFinancialYear = createAsyncThunk("user/updateFinancialYear", async ({ id, data }, { rejectWithValue, dispatch, getState }) => {

    try {
        dispatch(setShowError(false));

        const res = await putData(`/admin/updateFinancialYear/${id}`, data);
        toast.success("Financial year updated successfully.");
        dispatch(fetchFinancialYear())
        return res?.data
    } catch (error) {
        return handleError(error, dispatch, rejectWithValue);
    }

});

export const addFinancialYear = createAsyncThunk("user/addFinancialYear", async (data, { rejectWithValue, dispatch}) => {
    try {
        dispatch(setShowError(false));

        const res = await postData(`/admin/createFinancialYear`, data);
        toast.success("Financial year created successfully.");
        dispatch(fetchFinancialYear())
        return res
    } catch (error) {

        return handleError(error, dispatch, rejectWithValue);
    }

});
