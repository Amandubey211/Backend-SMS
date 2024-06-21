import { createSlice } from "@reduxjs/toolkit";

const classSectionsSlice = createSlice({
  name: "classSections",
  initialState: {
    sectionName: "",
    sectionId: "",
    sectionData: null,
  },
  reducers: {
    setSectionData: (state, action) => {
      state.sectionName = action.payload.sectionName;
      state.sectionId = action.payload.sectionId;
      state.sectionData = action.payload.sectionData;
    },
  },
});

export const { setSectionData } = classSectionsSlice.actions;
export default classSectionsSlice.reducer;
