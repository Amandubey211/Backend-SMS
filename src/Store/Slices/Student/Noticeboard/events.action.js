import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import { format, parseISO, isValid } from "date-fns";

export const stdEvent = createAsyncThunk(
    'event/studentEvents',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return rejectWithValue(`Authentication failed!`);
        }
        try {
            const res = await axios.get(`${baseUrl}/admin/all/events`, {
                headers: { Authentication: token }
            });

            const data=res?.data;
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
            return rejectWithValue((error?.response?.data?.message || error?.message || "Something Went Wrong!"))
        }
    }
)