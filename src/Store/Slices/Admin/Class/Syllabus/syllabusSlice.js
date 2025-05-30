import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSyllabus,
  deleteSyllabus,
  createSyllabus,
  editSyllabus,
} from "./syllabusThunk";

const initialState = {
  syllabi: [],
  selectedSyllabus: null,
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
    select: false,
  },
  error: null,
  filters: {
    // Add this filters object
    searchQuery: "",
    sectionIds: [],
    groupIds: [],
  },
};

const syllabusSlice = createSlice({
  name: "syllabus",
  initialState,
  reducers: {
    setSelectedSyllabus: (state, action) => {
      state.selectedSyllabus = action.payload;
    },
    clearSelectedSyllabus: (state) => {
      state.selectedSyllabus = null;
    },
    setSyllabusFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetSyllabusState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Syllabus
      .addCase(fetchSyllabus.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.syllabi = action.payload;
        // Auto-select first syllabus if none selected
        if (!state.selectedSyllabus && action.payload?.length > 0) {
          state.selectedSyllabus = action.payload[0];
        }
      })
      .addCase(fetchSyllabus.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Delete Syllabus
      .addCase(deleteSyllabus.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteSyllabus.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.syllabi = state.syllabi.filter((s) => s._id !== action.payload);
        // Clear selected if it was deleted
        if (state.selectedSyllabus?._id === action.payload) {
          state.selectedSyllabus =
            state.syllabi.length > 0 ? state.syllabi[0] : null;
        }
      })
      .addCase(deleteSyllabus.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      })

      // Create Syllabus
      .addCase(createSyllabus.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createSyllabus.fulfilled, (state, action) => {
        state.loading.create = false;
        state.syllabi.push(action.payload);
        // Auto-select newly created syllabus
        state.selectedSyllabus = action.payload;
      })
      .addCase(createSyllabus.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      // Edit Syllabus (Optimistic Update)
      .addCase(editSyllabus.pending, (state, action) => {
        state.loading.update = true;
        state.error = null;
        // Optimistically update selected syllabus
        const updatedSyllabus = action.meta.arg.data; // Extract the data being sent for edit
        if (
          state.selectedSyllabus &&
          state.selectedSyllabus._id === updatedSyllabus._id
        ) {
          // Make an optimistic change to the selected syllabus
          state.selectedSyllabus = {
            ...state.selectedSyllabus,
            ...updatedSyllabus,
          };
        }
      })
      .addCase(editSyllabus.fulfilled, (state, action) => {
        state.loading.update = false;
        // Update with the actual data from the server
        const updatedSyllabus = action.payload;
        state.selectedSyllabus = updatedSyllabus;
      })
      .addCase(editSyllabus.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
        // Revert changes if the edit failed
        if (state.selectedSyllabus) {
          const originalSyllabus = state.syllabi.find(
            (syllabus) => syllabus._id === state.selectedSyllabus._id
          );
          state.selectedSyllabus = originalSyllabus || null;
        }
      });
  },
});

export const {
  setSelectedSyllabus,
  clearSelectedSyllabus,
  setSyllabusFilters,
  resetSyllabusState,
} = syllabusSlice.actions;
export default syllabusSlice.reducer;
