import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";

export const stdModule = createAsyncThunk(
    'module/stdModule',
    async ({ cid, sid }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true))
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false))
            const res = await axios.get(`${baseUrl}/admin/student/classes/${cid}/modules/${sid}`, {
                headers: {
                    Authentication: token
                }
            });
            const data = res?.data?.data;
            console.log("std module action--->", data);
            return data;

        } catch (error) {
            console.log("Error in student Module", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
            //return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)