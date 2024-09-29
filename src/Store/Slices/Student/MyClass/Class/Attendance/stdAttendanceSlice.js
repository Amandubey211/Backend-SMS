import { createSlice } from "@reduxjs/toolkit"
import moment from "moment"
import { stdAttendance } from "./stdAttendance.action";



const initialState = {
    loading: false,
    error: false,
    attendanceData: {},
    summary: {
        presentCount: 0,
        absentCount: 0,
        leaveCount: 0,
    },
    currentDate: moment()
}

const stdAttendanceSlice = createSlice({
    name: "studentAttendance",
    initialState,
    reducers: {
        setCurrentDate: (state, action) => {
            state.currentDate = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(stdAttendance.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload.summary;
                state.attendanceData = action.payload?.report?.reduce((acc, entry) => {
                    acc[entry?.date] = entry.status;
                    return acc;
                }, {})
            })
            .addCase(stdAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
    }
});

export const { setCurrentDate } = stdAttendanceSlice.actions;
export default stdAttendanceSlice.reducer;