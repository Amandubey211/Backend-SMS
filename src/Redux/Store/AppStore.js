import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import AuthSliceReducer from "../Slices/Auth/AuthSlice.js";
import sidebarReducer from "../Slices/Common/SidebarSlice.js";
import AdminReducers from "../Slices/AdminSlice.js";
import CommonReducers from "../Slices/Common/CommonSlice.js";
import ClassReducer from "../Slices/Admin/ClassSlice.js";
import TeachersReducer from "../Slices/Admin/TeachersSlice.js";
import SubjectReducer from "../Slices/Admin/SubjectSlice.js";
import StudentQuizReducer from "../Slices/StudentQuiz/StudentQuizSlice.js";
import studentReducer from "../Slices/Admin/StudentSlice.js";
import staffReducer from "../Slices/Admin/StaffSlice.js";
import parentsReducer from "../Slices/Admin/parentsSilce.js";

// Persist configuration for Auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "role", "userDetail"], // Only persist these fields
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  AuthSliceReducer
);

// Persist configuration for Common slice
const commonPersistConfig = {
  key: "common",
  storage,
  whitelist: [
    "NavbarData",
    "selectedClass",
    "selectedSubject",
    "selectedAssignmentName",
    "studentId",
  ], // Persist NavbarData and selectedClassName
};

const persistedCommonReducer = persistReducer(
  commonPersistConfig,
  CommonReducers
);

const AppStore = configureStore({
  reducer: {
    Admin: AdminReducers,
    Auth: persistedAuthReducer, // Use persisted reducer for Auth
    sidebar: sidebarReducer,
    Common: persistedCommonReducer, // Use persisted reducer for Common
    Class: ClassReducer,
    Teachers: TeachersReducer,
    Staff: staffReducer,
    Subject: SubjectReducer,
    StudentQuiz: StudentQuizReducer,
    Students: studentReducer,
    Parents: parentsReducer,
  },
});

const persistor = persistStore(AppStore);

export { AppStore, persistor };
