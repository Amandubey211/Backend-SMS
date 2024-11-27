import { createAsyncThunk } from "@reduxjs/toolkit";
import { setShowError } from "../../../Common/Alerts/alertsSlice";
import { handleError } from "../../../Common/Alerts/errorhandling.action";
import { getAY } from "../../../../../Utils/academivYear";
import { deleteData, getData, postData, putData } from "../../../../../services/apiEndpoints";



// Fetch Student Fees
export const fetchFees = createAsyncThunk(
    "accounting/studentFees",
    async (_, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await getData(`/admin/get_fees?say=${say}`);
            console.log("response", response);

            return response?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Fetch Classes
export const fetchClasses = createAsyncThunk(
    "accounting/fetchClasses",
    async (_, { rejectWithValue, dispatch }) => {

        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await getData(`/admin/class?say=${say}`);

            return response?.data?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Delete Student Fee
export const deleteStudentFee = createAsyncThunk(
    "accounting/deleteStudentFee",
    async (feeId, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await deleteData(`/admin/fee/delete/${feeId}?say=${say}`);

            return response?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Create Student Fee
export const createStudentFee = createAsyncThunk(
    "accounting/createStudentFee",
    async ({ submissionData }, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await postData(`/admin/student/create_fees?say=${say}`, submissionData);

            return response?.data?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);

// Update Student Fee
export const updateStudentFee = createAsyncThunk(
    "accounting/updateStudentFee",
    async ({ feeId, submissionData }, { rejectWithValue, dispatch }) => {
        try {
            const say = getAY();
            dispatch(setShowError(false));
            const response = await putData(`/admin/student/update_fees/${feeId}?say=${say}`, submissionData);

            return response?.data;
        } catch (error) {
            return handleError(error, dispatch, rejectWithValue);
        }
    }
);
