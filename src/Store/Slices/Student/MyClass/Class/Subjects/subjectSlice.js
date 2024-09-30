import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    subject: {
        subjectId: null,
        subjectName: null,
    }
};

export const stdSubjectSlice = createSlice({
    name: "studentSubject",
    initialState,
    reducers: {
        setSubject: (state, action) => {
            console.log("subjects in slice.....===>",action.payload)
            state.subject = action.payload;
        }
    }
});

export const { setSubject } = stdSubjectSlice.actions;
export default stdSubjectSlice.reducer; 