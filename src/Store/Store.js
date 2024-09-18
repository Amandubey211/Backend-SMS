import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./Slices/Common/Auth/reducers/authSlice"; // Importing the auth slice reducer
import userReducer from "./Slices/Common/User/reducers/userSlice"; // Importing the user slice reducer
import studentFinanceReducer from "./Slices/Student/Finance/financeSlice"; // Importing finance slice
import classReducer from "./Slices/Admin/Class/reducer/classSlice"; // Importing the combined admin reducer
import { combineReducers } from "redux";

// Persist configuration for the Auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "isLoggedIn",
    "role",
    "AcademicYear",
    "token",
    "selectedLanguage",
  ], // Fields to persist
};

// Persist configuration for the User slice
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: [
    "userDetails",
    "navbar", // Persist NavbarData
    "classInfo.selectedClass",
    "classInfo.selectedClassName",
    "classInfo.selectedSection",
    "classInfo.selectedSectionName",
    "subjectInfo.selectedSubject",
    "subjectInfo.selectedSubjectName",
    "subjectInfo.selectedAssignmentName",
    "user.studentId", // Persist studentId
  ], // Whitelist fields based on the refined state structure in userSlice
};

// Combine the Auth and User reducers under a Common entity
const commonReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
});
const AdminReducer = combineReducers({
  class: classReducer,
});
// Create the store
const store = configureStore({
  reducer: {
    common: commonReducer, // Grouping Auth and User under Common
    studentFinance: studentFinanceReducer, // Other slices remain unchanged
    admin: AdminReducer, // Grouping all admin-related reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check due to redux-persist
    }), // Thunk is automatically included by Redux Toolkit
});

const persistor = persistStore(store);

export { store, persistor };
