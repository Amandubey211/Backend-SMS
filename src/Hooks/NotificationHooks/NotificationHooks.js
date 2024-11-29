import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDppitmp2HvLospsMAfOuvq2SsHpKvId5E",
  authDomain: "school-management-system-3f735.firebaseapp.com",
  projectId: "school-management-system-3f735",
  storageBucket: "school-management-system-3f735.appspot.com",
  messagingSenderId: "23404838622",
  appId: "1:23404838622:web:8a53f62c7710f8fa2e8c4f",
  measurementId: "G-1TLNLSCHP8",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // console.log("Notification permission granted.");

      const token = await getToken(messaging, {
        vapidKey:
          "BE2aOEIZNs60qnKRqlazM2rjZ-DYlbYhsBSjVTNZiSX3rLiB_7ISUO5yp0CK_6ApDNlX9cCltzI9SlnPcd7KRv0",
      });
      // console.log("Device token:", token);
      return token;
    } else {
      // console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error(
      "An error occurred while requesting permission or getting the token:",
      error
    );
  }
};
export const useFirebaseMessaging = () => {
  useEffect(() => {
    requestPermissionAndGetToken();

    const sendTokenToServer = async (token) => {
      try {
        const response = await fetch(
          "http://localhost:8080/firebasetoken/store-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (response.ok) {
          // console.log("Token successfully sent to the server.");
        } else {
          console.error("Failed to send token to server:", response.statusText);
        }
      } catch (error) {
        console.error(
          "An error occurred while sending token to the server:",
          error
        );
      }
    };

    const onMessageListener = () => {
      onMessage(messaging, (payload) => {
        // console.log("Message received. Payload:", payload);
        const notifications =
          JSON.parse(localStorage.getItem("notifications")) || [];
        notifications.push(payload);
        localStorage.setItem("notifications", JSON.stringify(notifications));
        // console.log("Notification saved to local storage:", payload);
      });
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        requestPermissionAndGetToken();
        onMessageListener();
      });
    } else {
      console.error("Service Worker is not supported in this browser.");
    }
  }, []);

  return null;
};
