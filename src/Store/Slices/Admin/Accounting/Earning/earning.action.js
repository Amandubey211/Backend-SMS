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

export const fetchEarning = createAsyncThunk(
    "accounting/earning",
    async (_, { rejectWithValue, getState }) => {
        const token = getToken(getState());

        try {
            const response = await axios.get(`${baseUrl}/admin/getearning`, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data?.earnings
            console.log("data---", data);
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }

)

export const fetchTotalAmounts = createAsyncThunk(
    "accounting/fetchtotalamounts",
    async (_, { rejectWithValue, getState }) => {
        const token = getToken(getState());

        try {
            const response = await axios.get(`${baseUrl}/admin/total_amount`, {
                headers: {
                    Authentication: `${token}`,
                },
            });

            const data = response?.data
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }

)

export const updateEarning = createAsyncThunk(
    "accounting/updateEarning",
    async ({ id, updatedEarning }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.put(`${baseUrl}/admin/updateEarning/${id}`, updatedEarning, {
                headers: {
                    Authentication: `${token}`
                },
            });

            const data = response?.data
            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }

)

export const createEarning = createAsyncThunk(
    "accounting/createEarning",
    async ({ payload }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.post(`${baseUrl}/admin/addEarning`, payload, {
                headers: {
                    Authentication: `${token}`
                },
            });

            const data = response?.data
            console.log("response of create", response);

            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }

)


export const deleteEarning = createAsyncThunk(
    "accounting/deleteEarning",
    async ({ id }, { rejectWithValue, getState }) => {
        const token = getToken(getState());
        try {
            const response = await axios.delete(`${baseUrl}/admin/deleteEarning/${id}`, {
                headers: {
                    Authentication: `${token}`
                },
            });

            const data = response?.data
            console.log("response of create", response);

            return data

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error?.message || "Something Went Wrong!");
        }
    }
)