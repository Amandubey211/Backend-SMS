import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../../config/Common";
import { ErrorMsg } from "../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../Common/Alerts/alertsSlice";



export const stdClass = createAsyncThunk(
    'class/studentClass',
    async (_, { rejectWithValue,dispatch }) => {
        const token = localStorage.getItem("student:token");
        if(!token) {
           return rejectWithValue("Authentication failed!");
        }
        try {
            const res = await axios.get(`${baseUrl}/student/my_class`, {
                headers: {
                    Authentication: token,
                },
            });
           console.log("data in action class :",res.data.data)
            const data = res?.data?.data;
            return data;
        } catch (error) {
            console.log("Error in student Class", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)