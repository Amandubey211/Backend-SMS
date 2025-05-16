import { useEffect } from "react";
import { useSocket } from "../../Components/Common/SocketContext";

/**
 * Keeps a component subscribed to one trip room.
 * – automatically joins when tripId is truthy
 * – auto-cleans on unmount or when id changes
 * – forwards every “location” payload to the callback
 * – logs *everything* for easy debugging
 */
export const useTripLocationSocket = (tripId, onLocation) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !tripId) return;

    const room = `trip-${tripId}`;
    console.debug(`[socket] joining → ${room}`);
    socket.emit("join-trip", { room });

    const handle = (payload) => {
      console.debug("[socket] 📦 location payload:", payload);
      if (payload.tripId === tripId) onLocation(payload);
    };

    socket.on("location", handle);

    return () => {
      console.debug(`[socket] leaving ← ${room}`);
      socket.emit("leave-trip", { room });
      socket.off("location", handle);
    };
  }, [socket, tripId, onLocation]);
};
