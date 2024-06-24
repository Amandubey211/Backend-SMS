import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "../Slices/AuthSlice.js";
import sidebarReducer from "../Slices/SidebarSlice.js";
import AdminReducers from "../Slices/AdminSlice.js";
import CommonReducers from "../Slices/Common/CommonSlice.js";
import ClassReducer from "../Slices/Admin/ClassSlice.js";
import TeachersReducer from "../Slices/Admin/TeachersSlice.js";
import SubjectReducer from "../Slices/Admin/SubjectSlice.js"
const AppStore = configureStore({
  reducer: {
    Admin: AdminReducers,
    Auth: AuthSliceReducer,
    sidebar: sidebarReducer,
    Common: CommonReducers,
    Class: ClassReducer,
    Teachers: TeachersReducer, 
    Subject:SubjectReducer
  },
});

export default AppStore;
