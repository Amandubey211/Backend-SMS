import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";




const getToken = (state) => {
    const token = state.common.auth?.token;
    if (!token) {
        throw new Error("Authentication token is missing.");
    }
    return `Bearer ${token}`;
};

export const fetchFees = createAsyncThunk(
    "accounting/studentFees",
    async (_, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.get(`${baseUrl}/admin/get_fees`, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data?.data
            console.log("data---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const fetchClasses = createAsyncThunk(
    "accounting/fetchClasses",
    async (_, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.get(`${baseUrl}/admin/class`, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data?.data
            console.log("fetch classes data---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const deleteStudentFee = createAsyncThunk(
    "accounting/deleteStudentFee",
    async (feeId, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.delete(`${baseUrl}/admin/fee/delete/${feeId}`, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data
            console.log("delete student fees---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const createStudentFee = createAsyncThunk(
    "accounting/createStudentFee",
    async ({ submissionData }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.post(`${baseUrl}/admin/student/create_fees`, submissionData, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data?.data
            console.log("Fees for student created---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)

export const updateStudentFee = createAsyncThunk(
    "accounting/updateStudentFee",
    async ({ feeId, submissionData }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.put(`${baseUrl}/admin/student/update_fees/${feeId}`, submissionData, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data
            console.log("Fees for student created---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)