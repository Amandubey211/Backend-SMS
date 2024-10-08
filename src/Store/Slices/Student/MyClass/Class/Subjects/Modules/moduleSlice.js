import { createSlice } from "@reduxjs/toolkit";
import { stdModule } from "./module.action";

const initialState = {
    loading: false,
    error: false,
    modulesData: [],
    subjectName:null,
    expandedChapters: [],
    selectedModule: {
        moduleId: null,
        name: null,
        chapters: [],
    }
};

const stdModuleslice = createSlice({
    name: "stdSubjectModule",
    initialState,
    reducers: {
        setSelectedModule:(state,action)=>{
            state.selectedModule=action.payload;
        },
        setExpandedChapters:(state,action)=>{
            state.expandedChapters=action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(stdModule.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(stdModule.fulfilled, (state, action) => {
                state.loading = false;
                state.modulesData = action.payload?.modules;
                state.subjectName=action.payload?.subjectName;
            })
            .addCase(stdModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || true;
            })
    }
});


export const {  setSelectedModule,setExpandedChapters } = stdModuleslice.actions;
export default stdModuleslice.reducer;
