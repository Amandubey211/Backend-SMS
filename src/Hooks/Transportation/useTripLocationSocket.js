import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "../../config/Common";

const SOCKET_URL = baseUrl;

export const useTripLocationSocket = (tripId, onLocationUpdate) => {
  const socketRef = useRef(null);
  console.log("ttt->",tripId)
  console.log("ooooo->",onLocationUpdate)

  useEffect(() => {
    // Create socket only once
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"], // force websocket (optional)
      });

      socketRef.current.on("connect", () => {
        console.log("📡 Connected to WebSocket", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ WebSocket Disconnected");
      });
    }

    const socket = socketRef.current;

    const handleLocation = (data) => {

        console.log("📍 New location:", data);
        onLocationUpdate(data);
      
    };

    socket.on("location", handleLocation);

    return () => {
      socket.off("location", handleLocation); // remove listener only
    };
  }, [tripId, onLocationUpdate]);
};
