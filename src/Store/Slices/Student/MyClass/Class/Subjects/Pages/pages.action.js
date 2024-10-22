import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";

export const stdPages = createAsyncThunk(
    'pages/stdPages',
    async ({ classId }, { rejectWithValue , dispatch}) => {
        console.log("i am pages class",classId)
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));
            const res = await axios.get(`${baseUrl}/admin/api/pages/class/pages/${classId}`, {
                headers: {
                    Authentication: token
                }
            });
            console.log("i am pages in action>>>>>>", res?.data?.data)
            const data = res?.data?.data;
            return data;

        } catch (error) {
            console.log("Error in student Pages", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)
export const fetchPageView = createAsyncThunk(
    'pages/pageView',
    async (pageId, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue("Authentication failed!");
        }

        try {
            const res = await axios.get(`${baseUrl}/student/pages/${pageId}`, {
                headers: {
                    Authentication: token
                }
            });
            const data = res?.data
            return data;

        } catch (error) {
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)