import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError,setErrorMsg } from "../../../Common/Alerts/alertsSlice";
const say = localStorage.getItem("say");
export const stdClass = createAsyncThunk(
    'class/studentClass',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        const say = localStorage.getItem("say")
        if (!token) {
            dispatch(setShowError(true));
            dispatch(setErrorMsg("Authentication failed!"));

            return rejectWithValue("Authentication failed!");
        }
        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/my_class?say=${say}`, {
                headers: {
                    Authentication: token,
                },
            });
            console.log("data in action class :", res.data.data)
            const data = res?.data?.data;
            return data;
        } catch (error) {
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            dispatch(setErrorMsg(err.message));
            return rejectWithValue(err.message);
        }
    }
)