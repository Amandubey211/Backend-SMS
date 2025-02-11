import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setSelectedSemester } from "../../Store/Slices/Common/User/reducers/userSlice"; // adjust path as needed

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setSelectedSemester),
  effect: async (action, listenerApi) => {
    // Reload the page after the action is dispatched
    window.location.reload();
  },
});

export default listenerMiddleware;
