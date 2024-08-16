
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

// Open IndexedDB for storing notifications
let db;

const openDB = () => {
  const request = indexedDB.open('firebase-messaging-store', 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('notifications', { keyPath: 'messageId', autoIncrement: true });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB initialized successfully');
  };

  request.onerror = (event) => {
    console.error('IndexedDB initialization failed', event);
  };
};

const saveNotificationToIndexedDB = (notification) => {
  if (db) {
    const transaction = db.transaction(['notifications'], 'readwrite');
    const objectStore = transaction.objectStore('notifications');
    objectStore.add({ ...notification, timestamp: new Date().toISOString() });

    transaction.oncomplete = () => {
      console.log('Notification saved to IndexedDB');
    };

    transaction.onerror = (event) => {
      console.error('Failed to save notification to IndexedDB', event);
    };
  } else {
    console.error('Database is not initialized');
  }
};

openDB();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification.body || 'Background Message body.',
    icon: payload.notification.icon || '/firebase-logo.png'
  }
  // Save notification to IndexedDB
  saveNotificationToIndexedDB(payload.notification);

  self.registration.showNotification(notificationTitle, notificationOptions);
});