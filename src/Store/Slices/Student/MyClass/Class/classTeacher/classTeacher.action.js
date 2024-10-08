import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
import { ErrorMsg } from "../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../Common/Alerts/alertsSlice";


export const stdClassTeacher = createAsyncThunk(
    'classTecher/stdClassTeacher',
    async ({ classId }, { rejectWithValue, dispatch }) => {
        console.log("id-------->", classId)
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue("Authentication failed!");
        }
        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/my_teachers/${classId}`, {
                headers: {
                    Authentication: token
                }
            });

            console.log("my class teacher", res.data.data)
            const data = res?.data?.data;
            return data;
        } catch (error) {
            console.log("Error in student class teacher", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)