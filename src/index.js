import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App";
import { Provider } from "react-redux";
import AppStore from "./Redux/Store/AppStore";

// Register the Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../public/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registration successful with scope: ', registration.scope);
    })
    .catch((err) => {
      console.error('Service Worker registration failed: ', err);
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={AppStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
