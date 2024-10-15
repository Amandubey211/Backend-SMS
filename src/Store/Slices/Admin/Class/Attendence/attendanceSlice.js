import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAttendanceByClassSectionGroupDate,
  markAttendance,
  fetchAttendanceStats,
  fetchStudentsMonthAttendanceList, // Import the monthly attendance thunk
} from "./attendanceThunks";

const initialState = {
  attendanceData: [],
  stats: {},
  monthlyAttendance: [], // Added monthly attendance state
  filters: {
    sectionId: "",
    groupId: "",
    month: new Date().getMonth() + 1, // Default to the current month
    filter: "",
  },
  selectedDate: new Date(),
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload, // Merging new filters with the existing state
      };
    },
    resetFilters: (state) => {
      state.filters = {
        sectionId: "",
        groupId: "",
        month: new Date().getMonth() + 1, // Reset to current month
        filter: "",
      };
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    updateStudentAttendanceStatus: (state, action) => {
      const { studentId, status } = action.payload;
      const studentIndex = state.attendanceData.findIndex(
        (student) => student.studentId === studentId
      );

      if (studentIndex !== -1) {
        // If attendanceStatus is not an array, initialize it as an empty array
        if (
          !Array.isArray(state.attendanceData[studentIndex].attendanceStatus)
        ) {
          state.attendanceData[studentIndex].attendanceStatus = [];
        }

        // Directly update the attendance status for the student
        state.attendanceData[studentIndex].attendanceStatus = status;
      }
    },

    clearAttendanceState: (state) => {
      state.attendanceData = [];
      state.error = null;
      state.stats = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance data for a class section and group by date
      .addCase(fetchAttendanceByClassSectionGroupDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAttendanceByClassSectionGroupDate.fulfilled,
        (state, action) => {
          state.loading = false;
          state.attendanceData = action.payload.attendanceList || [];
          state.stats = action.payload.attendanceStats || {};
        }
      )
      .addCase(
        fetchAttendanceByClassSectionGroupDate.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Mark attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch attendance stats
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch students' monthly attendance list
      .addCase(fetchStudentsMonthAttendanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsMonthAttendanceList.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyAttendance = action.payload.attendanceList || [];
      })
      .addCase(fetchStudentsMonthAttendanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exporting the actions
export const {
  setFilters,
  resetFilters,
  setSelectedDate,
  updateStudentAttendanceStatus,
  clearAttendanceState,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
