import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../../config/Common";
import axios from "axios";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../Common/Alerts/alertsSlice";
const say = localStorage.getItem("say");

export const studentNotice = createAsyncThunk(
    'announcement/studentNotice',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg(`Authentication failed!`));
            return rejectWithValue(`Authentication failed!`);
        }
        try {
            dispatch(setShowError(false));
            const res = await axios.get(`${baseUrl}/admin/all/notices?say=${say}`, {
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
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)