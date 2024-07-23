import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "../Slices/AuthSlice.js";
import sidebarReducer from "../Slices/SidebarSlice.js";
import AdminReducers from "../Slices/AdminSlice.js";
import CommonReducers from "../Slices/Common/CommonSlice.js";
import ClassReducer from "../Slices/Admin/ClassSlice.js";
import TeachersReducer from "../Slices/Admin/TeachersSlice.js";
import SubjectReducer from "../Slices/Admin/SubjectSlice.js"
import StudentQuizReducer from "../Slices/StudentQuiz/StudentQuizSlice.js";
import studentReducer from '../Slices/Admin/StudentSlice.js'
import staffReducer from '../Slices/Admin/StaffSlice.js';
import parentsReducer from '../Slices/Admin/parentsSilce.js';
const AppStore = configureStore({

  reducer: {
    Admin: AdminReducers,
    Auth: AuthSliceReducer,
    sidebar: sidebarReducer,
    Common: CommonReducers,
    Class: ClassReducer,
    Teachers: TeachersReducer, 
    Staff: staffReducer, 
    Subject:SubjectReducer,
    StudentQuiz: StudentQuizReducer,
    Students:studentReducer,
    Parents:parentsReducer,
     // Add StudentQuizSlice to the store

  },
});

export default AppStore;

