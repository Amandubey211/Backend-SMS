import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { format, parseISO, isValid } from "date-fns";
import { ErrorMsg } from "../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../Common/Alerts/alertsSlice";

export const stdEvent = createAsyncThunk(
    'event/studentEvents',
    async (_, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue(`Authentication failed!`);
        }
        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/admin/all/events`, {
                headers: { Authentication: token }
            });

            const data = res?.data;
            const formattedEvents = data?.events?.map((event, index) => ({
                ...event,
                id: index,
                startDate: parseISO(event.date),
                endDate: new Date(
                    new Date(event.date).setHours(new Date(event.date).getHours() + 2)
                ),
            }));

            return formattedEvents;
        }

        catch (error) {
            console.log("Error in stdEvent", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)