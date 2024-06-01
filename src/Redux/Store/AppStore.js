import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "../Slices/AuthSlice.js";
import sidebarReducer from "../Slices/SidebarSlice.js";
import AdminReducers from "../Slices/AdminSlice.js";
import CommonReducers from "../Slices/CommonSlice.js";
const AppStore = configureStore({
  reducer: {
    Admin: AdminReducers,
    Auth: AuthSliceReducer,
    sidebar: sidebarReducer,
    Common: CommonReducers,
  },
});

export default AppStore;
