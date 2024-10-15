import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { baseUrl } from "../../../../../../../config/Common";



export const stdGetAssignment = createAsyncThunk(
    'assignment/stdGetAssignment',
    async (_, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!');
        }

        try {
            dispatch(setShowError(false));
            const res = await axios.get(`${baseUrl}/`, {
                headers: {
                    Authentication: token
                }
            });

            const data = res?.data;
            console.log(data);
        } catch (error) {
            console.log("Error in student class teacher", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
) 

export const stdDoAssignment = createAsyncThunk(
    'assignment/stdDoAssignment',
    async ({}, { rejectWithValue, dispatch }) => {

        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!');
        }

        try {
            dispatch(setShowError(false));
            const res = await axios.put(`${baseUrl}/`,{
                headers: {
                    Authentication: token
                }
            });

            const data = res?.data;
            console.log(data);
        } catch (error) {
            console.log("Error in student class teacher", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
) 