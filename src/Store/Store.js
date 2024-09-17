import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./Slices/Common/Auth/reducers/authSlice"; // Importing the auth slice reducer
import userReducer from "./Slices/Common/User/reducers/userSlice"; // Importing the user slice reducer
import studentFinanceReducer from './Slices/Student/Finance/financeSlice';
import studentLibraryBooksReducer from './Slices/Student/Library/libararySlice'; 
import studentIssueBooksReducer from './Slices/Student/Library/bookIssuesSlice'; 
// Persist configuration for the Auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "role", "AcademicYear", "token","selectedLanguage"], // Fields to persist
};

// Persist configuration for the User slice (formerly CommonSlice)
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

// Apply the persist reducer to the Auth and User slices
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Create the store
const store = configureStore({
  reducer: {
    Auth: persistedAuthReducer, // Using persisted auth reducer
    User: persistedUserReducer, // Using persisted user reducer
    studentFinance:studentFinanceReducer,
    studentLibraryBooks:studentLibraryBooksReducer,
    studentIssueBooks:studentIssueBooksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check due to redux-persist
    }), // Thunk is automatically included by Redux Toolkit
});

const persistor = persistStore(store);

export { store, persistor };
