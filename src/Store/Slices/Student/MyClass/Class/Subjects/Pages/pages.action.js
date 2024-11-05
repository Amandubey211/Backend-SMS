import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setShowError,setErrorMsg } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem("say");

export const stdPages = createAsyncThunk(
    'pages/stdPages',
    async ({ classId }, { rejectWithValue , dispatch}) => {
        console.log("i am pages class",classId)
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));
            const res = await axios.get(`${baseUrl}/admin/api/pages/class/pages/${classId}?say=${say}`, {
                headers: {
                    Authentication: token
                }
            });
            console.log("i am pages in action>>>>>>", res?.data?.data)
            const data = res?.data?.data;
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)
export const fetchPageView = createAsyncThunk(
    'pages/pageView',
    async (pageId, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            const res = await axios.get(`${baseUrl}/student/pages/${pageId}?say=${say}`, {
                headers: {
                    Authentication: token
                }
            });
            const data = res?.data
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)