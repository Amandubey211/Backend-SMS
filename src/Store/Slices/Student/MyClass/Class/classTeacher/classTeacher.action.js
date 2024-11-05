import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";
import { setErrorMsg, setShowError } from "../../../../Common/Alerts/alertsSlice";

const say = localStorage.getItem("say");

export const stdClassTeacher = createAsyncThunk(
    'classTeacher/stdClassTeacher',
    async ({ classId }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));
            return rejectWithValue("Authentication failed!");
        }

        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/my_teachers/${classId}?say=${say}`, {
                headers: {
                    Authentication: token
                }
            });

            console.log("Class teacher data:", res.data.data);
            const data = res?.data?.data;
            return data;
        } catch (error) {
            console.error("Error in fetching class teacher:", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
);
