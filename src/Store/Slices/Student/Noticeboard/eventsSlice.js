import { createSlice } from "@reduxjs/toolkit";
import { stdEvent } from "./events.action";

const currentDate = new Date();

const initialState = {
    loading: false,
    error: false,
    currentDate: currentDate,
    eventData: [],
    filteredEvents: [],
    isSidebarOpen: false,
    sidebarContent: null,
    selectedEvent: null,
    currentPage: 0,
    itemsPerPage: 4,
}

const stdEventsSlice = createSlice({
    name: "stdEventSlice",
    initialState,
    reducers: {
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload;
        },
        setSidebarContent: (state, action) => {
            state.sidebarContent = action.payload;
        },
        setFilteredEvents: (state, action) => {
            console.log("filter event slice: ", action.payload)
            state.filteredEvents = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(stdEvent.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdEvent.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("hi i am std event:", action.payload)
                state.eventData = action.payload;
            })
            .addCase(stdEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  || true;
            })
    }
});


export const { setSelectedEvent, setSidebarContent,
    setFilteredEvents, setCurrentPage, setSidebarOpen,
    setSelectedMonthYear } = stdEventsSlice.actions;
export default stdEventsSlice.reducer; 