importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyDppitmp2HvLospsMAfOuvq2SsHpKvId5E",
    authDomain: "school-management-system-3f735.firebaseapp.com",
    projectId: "school-management-system-3f735",
    storageBucket: "school-management-system-3f735.appspot.com",
    messagingSenderId: "23404838622",
    appId: "1:23404838622:web:8a53f62c7710f8fa2e8c4f",
    measurementId: "G-1TLNLSCHP8"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
