import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "../Slices/AuthSlice.js";
import sidebarReducer from "../Slices/SidebarSlice.js";
const AppStore = configureStore({
  reducer: {
    Auth: AuthSliceReducer,
    sidebar: sidebarReducer,
  },
});

export default AppStore;
