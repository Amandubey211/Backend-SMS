import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setShowError,setErrorMsg } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem("say");

export const stdModule = createAsyncThunk(
    'module/stdModule',
    async ({ cid, sid }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false))
            const res = await axios.get(`${baseUrl}/admin/student/classes/${cid}/modules/${sid}?say=${say}`, {
                headers: {
                    Authentication: token
                }
            });
            const data = res?.data?.data;
            console.log("std module action--->", data);
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