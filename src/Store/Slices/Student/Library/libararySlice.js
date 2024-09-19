import { createSlice } from "@reduxjs/toolkit";
import { libraryBooksStudent } from "./libarary.action";



const initialState = {
    loading: false,
    error: false,
    libararyBooks: [],
    totalBooks: 0,
    filters: {
        class: "",
        category: "",
    },
    activeTab:"Library",
}

const stdLibrarySlice = createSlice({
    name: "studentLibrary",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        setActiveTab:(state,action)=>{
           state.activeTab=action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(libraryBooksStudent.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(libraryBooksStudent.fulfilled, (state,action) => {
                state.loading = false;
                state.libararyBooks=action.payload?.books;                ;
            })
            .addCase(libraryBooksStudent.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export const {setFilters,setActiveTab} = stdLibrarySlice.actions;
export default stdLibrarySlice.reducer;