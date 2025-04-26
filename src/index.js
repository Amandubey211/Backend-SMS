import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import { Provider } from "react-redux"; // Redux provider
import { PersistGate } from "redux-persist/integration/react"; // PersistGate from redux-persist
import { store, persistor } from "./Store/Store"; // Import store and persistor
import ErrorBoundary from "./Components/Common/ErrorBoundary";

// Import the ErrorBoundary component

// Service worker registration (optional but included here)
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       // Optional success logging
//       // console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((err) => {
//       console.error("Service Worker registration failed:", err);
//     });
// }
//dummy

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* Wrap your main App component with the ErrorBoundary */}
      {/* <ErrorBoundary> */}
      <App />
      {/* </ErrorBoundary> */}
    </PersistGate>
  </Provider>
);
