import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import { Provider } from "react-redux";
import { AppStore } from "./Redux/Store/AppStore";

// Comment out the i18n setup and the i18nextProvider
// import { I18nextProvider } from "react-i18next";
// import i18n from "./Utils/i18n";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log(
        "Service Worker registration successful with scope: ",
        registration.scope
      );
    })
    .catch((err) => {
      console.error("Service Worker registration failed: ", err);
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={AppStore}>
    {/* Remove the I18nextProvider */}
    <App /> {/* This is your main app component */}
  </Provider>
  // </React.StrictMode>
);
