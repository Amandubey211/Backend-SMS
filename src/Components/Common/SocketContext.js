import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";

/* ──────────────────────────────── contexts */
const SocketContext = createContext(null);
const SocketStatusContext = createContext("disconnected");

/* ──────────────────────────────── provider */
export const SocketProvider = ({ children }) => {
  const [status, setStatus] = useState("connecting");

  /** build only once */
  const socket = useMemo(
    () =>
      io(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:8080"
        }/transport`,
        {
          transports: ["websocket"],
          upgrade: false,
          path: "/socket.io",
          autoConnect: true,
        }
      ),
    []
  );

  /* lifecycle + debugging */
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.info("[socket] ✅ connected:", socket.id);
      setStatus("connected");
    };
    const onDisconnect = (reason) => {
      console.warn("[socket] ❌ disconnected:", reason);
      setStatus("disconnected");
    };
    const onError = (err) => {
      console.error("[socket] 🚨 connection error:", err.message);
      setStatus("error");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      <SocketStatusContext.Provider value={status}>
        {children}
      </SocketStatusContext.Provider>
    </SocketContext.Provider>
  );
};

/* ──────────────────────────────── hooks */
export const useSocket = () => useContext(SocketContext);
export const useSocketStatus = () => useContext(SocketStatusContext);
