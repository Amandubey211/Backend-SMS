import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import { setErrorMsg, setShowError } from "../../../../Common/Alerts/alertsSlice";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";
const say = localStorage.getItem("say");
export const stdSubjectProgressPercentage = createAsyncThunk(
    'progress/stdSubjectProgressPercentage',
    async ({studentId}, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue('Authentication failed!');
        }
        try {
            const res = await axios.get(`${baseUrl}/admin/course/subjects/student/${studentId}?say=${say}`, {
                headers: { Authentication: token }
            });
            const data= res?.data?.data;
           console.log('progress data ===>>',data)
            return data;

        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)