// // src/services/socketService.js
// import { io } from "socket.io-client";
// import { baseUrl } from "../config/Common";

// let socketInstance = null;

// export const initializeSocket = () => {
//   if (!socketInstance) {
//     socketInstance = io(baseUrl, {
//       transports: ["websocket"],
//       withCredentials: true, // This will send cookies automatically
//       autoConnect: false, // We'll connect manually after initialization
//     });

//     // Connection events
//     socketInstance.on("connect", () => {
//       console.log("Socket connected:", socketInstance.id);
//     });

//     socketInstance.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       if (reason === "io server disconnect") {
//         // Reconnect if server disconnects us
//         socketInstance.connect();
//       }
//     });

//     socketInstance.on("connect_error", (err) => {
//       console.error("Socket connection error:", err.message);
//       // Attempt reconnect after delay
//       setTimeout(() => {
//         socketInstance.connect();
//       }, 1000);
//     });

//     // Manual connect after setting up listeners
//     socketInstance.connect();
//   }
//   return socketInstance;
// };

// export const getSocket = () => {
//   if (!socketInstance) {
//     throw new Error("Socket not initialized. Call initializeSocket first.");
//   }
//   return socketInstance;
// };

// export const disconnectSocket = () => {
//   if (socketInstance) {
//     socketInstance.disconnect();
//     socketInstance = null;
//   }
// };

// // Helper function to wait for socket to be connected
// export const ensureSocketConnection = async () => {
//   const socket = getSocket();
//   if (socket.connected) return true;

//   return new Promise((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       reject(new Error("Socket connection timeout"));
//     }, 5000);

//     socket.once("connect", () => {
//       clearTimeout(timeout);
//       resolve(true);
//     });

//     socket.once("connect_error", (err) => {
//       clearTimeout(timeout);
//       reject(err);
//     });
//   });
// };
