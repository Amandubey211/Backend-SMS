import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";


export const studentNotice = createAsyncThunk(
    'announcement/studentNotice',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue(`Authentication failed!`);
        }
        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/admin/all/notices`, {
                headers: { Authentication: token }
            });

            const data = res?.data;

            const formatedData = data?.notices?.map((notice) => ({
                ...notice,
                startDate: new Date(notice.startDate),
                endDate: new Date(notice.endDate),

            }))
            return formatedData;

        }
        catch (error) {
            console.log("Error in student notice", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)