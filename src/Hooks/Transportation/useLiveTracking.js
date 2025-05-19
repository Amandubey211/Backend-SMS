// useLiveTracking.js - Custom Hook
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentLocation } from "../store/tripExecutionLogSlice";

const useLiveTracking = (tripId) => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);

  const connect = () => {
    if (!tripId) return;

    const wsUrl = `${
      process.env.REACT_APP_WS_URL
    }/tracking?adminId=${Date.now()}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;
      console.log(`WebSocket connected for trip ${tripId}`);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "location_update" && data.tripId === tripId) {
        dispatch(
          setCurrentLocation({
            lat: data.latitude,
            lng: data.longitude,
            speed: data.speed,
            timestamp: data.timestamp,
          })
        );
      }
    };

    wsRef.current.onclose = () => {
      setConnectionStatus("disconnected");
      this.attemptReconnect();
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };
  };

  const attemptReconnect = () => {
    if (reconnectAttempts.current >= 5) {
      console.log("Max reconnection attempts reached");
      return;
    }

    const delay = Math.min(
      1000 * Math.pow(2, reconnectAttempts.current),
      30000
    );
    reconnectAttempts.current++;

    reconnectTimer.current = setTimeout(() => {
      console.log(`Reconnection attempt ${reconnectAttempts.current}`);
      connect();
    }, delay);
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [tripId]);

  return { connectionStatus };
};

export default useLiveTracking;
