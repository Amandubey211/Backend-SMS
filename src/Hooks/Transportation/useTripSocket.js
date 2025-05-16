// // useTripSocket.js
// import { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// export const useTripSocket = (tripId, onLocationUpdate) => {
//   const socketRef = useRef(null);
//   const [socketConnected, setSocketConnected] = useState(false);

//   useEffect(() => {
//     if (!tripId) return;

//     // Initialize socket connection only when tripId exists
//     socketRef.current = io(process.env.REACT_APP_API_BASE_URL, {
//       autoConnect: false,
//     });

//     // Connect manually
//     socketRef.current.connect();

//     // Setup listeners
//     socketRef.current.on("connect", () => {
//       setSocketConnected(true);
//       socketRef.current.emit("subscribe", { tripId });
//     });

//     socketRef.current.on("disconnect", () => {
//       setSocketConnected(false);
//     });

//     socketRef.current.on("location", onLocationUpdate);

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.emit("unsubscribe", { tripId });
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setSocketConnected(false);
//       }
//     };
//   }, [tripId, onLocationUpdate]);

//   const requestLocation = () => {
//     if (socketRef.current?.connected) {
//       socketRef.current.emit("request_location", { tripId });
//     }
//   };

//   return { socketConnected, requestLocation };
// };
