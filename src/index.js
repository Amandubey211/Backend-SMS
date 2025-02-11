import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import { Provider } from "react-redux"; // Redux provider
import { PersistGate } from "redux-persist/integration/react"; // PersistGate from redux-persist
import { store, persistor } from "./Store/Store"; // Import store and persistor

// Service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      // console.log(
      //  "Service Worker registration successful with scope: ",
      // registration.scope
      // );
    })
    .catch((err) => {
      console.error("Service Worker registration failed: ", err);
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* PersistGate delays rendering until persisted state is loaded */}
    <PersistGate loading={null} persistor={persistor}>
      <App /> {/* This is your main app component */}
    </PersistGate>
  </Provider>
);
