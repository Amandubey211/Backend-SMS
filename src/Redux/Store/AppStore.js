import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "../Slices/AuthSlice.js";
import sidebarReducer from "../Slices/SidebarSlice.js";
import AdminReducers from "../Slices/AdminSlice.js";
import CommonReducers from "../Slices/Common/CommonSlice.js";
import ClassesReducer from "../Slices/Admin/AllClassSlice.js";
import ClassReducer from "../Slices/Admin/ClassSlice.js";
import ClassSectionsReducer from "../Slices/Admin/ClassSectionsSlice.js";
import TeachersReducer from "../Slices/Admin/TeachersSlice.js";
import SubjectReducer from "../Slices/Admin/SubjectSlice.js"
const AppStore = configureStore({
  reducer: {
    Admin: AdminReducers,
    Auth: AuthSliceReducer,
    sidebar: sidebarReducer,
    Common: CommonReducers,
    Classes: ClassesReducer,
    Class: ClassReducer,
    ClassSection: ClassSectionsReducer,
    Teachers: TeachersReducer, 
    Subject:SubjectReducer
  },
});

export default AppStore;
