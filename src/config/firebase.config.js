import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMeW4fCpoF0onz0sdcH_l4ntkQkx2yeLs",
  authDomain: "school-management-system-fe179.firebaseapp.com",
  projectId: "school-management-system-fe179",
  storageBucket: "school-management-system-fe179.firebasestorage.app",
  messagingSenderId: "208240648640",
  appId: "1:208240648640:web:b482f27289ac96fd9f2825",
  measurementId: "G-ZFH3093TEJ"
};

const vapidKey = "BJQa8N7pmhUNu7sFd151-fA403tPZxkvUNIId0ge3GwGOTThtnCO-YkhPI-F5clgyQ2lmrFjN5lBvlIF4hqqZ5o";

// Check if Firebase app is already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Initialize only if not already initialized
} else {
  app = getApp(); // Get the existing app
}

const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey });
      return token;
    } else {
      throw new Error("Notification permission not granted!");
    }
  } catch (error) {
    console.error("Error requesting FCM token:", error);
  }
};
