import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Input, Button, Slider, Card } from "antd";

export default function TransportSimulator() {
  const [tripId, setTripId] = useState("");
  const [speed, setSpeed] = useState(40);
  const [timer, setTimer] = useState(null);
  const [lat, setLat] = useState(25.3);
  const [lng, setLng] = useState(51.53);

  const socket = React.useMemo(
    () =>
      io(
        process.env.REACT_APP_SOCKET_URL || "http://localhost:8080/transport",
        {
          transports: ["websocket"],
          upgrade: false,
          path: "/socket.io",
        }
      ),
    []
  );

  const toggle = () => {
    if (timer) {
      clearInterval(timer); // stop
      setTimer(null);
      return;
    }
    if (!tripId) return alert("Enter tripId first!");

    const id = setInterval(() => {
      const jitter = () => (Math.random() - 0.5) * 0.002; // 200 m random walk
      setLat((l) => l + jitter());
      setLng((l) => l + jitter());

      socket.emit("location", {
        tripId,
        latitude: lat,
        longitude: lng,
        speed: speed / 3.6,
      });
      console.log("🚀 emit", lat, lng, speed);
    }, 4000);
    setTimer(id);
  };

  useEffect(() => () => timer && clearInterval(timer), [timer]);

  return (
    <Card
      title="Transport Simulator"
      style={{ maxWidth: 400, margin: "40px auto" }}
    >
      <Input
        placeholder="Trip ObjectID"
        value={tripId}
        onChange={(e) => setTripId(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div>Speed: {speed} km/h</div>
      <Slider
        min={10}
        max={80}
        step={5}
        value={speed}
        onChange={setSpeed}
        style={{ marginBottom: 16 }}
      />
      <Button type={timer ? "danger" : "primary"} block onClick={toggle}>
        {timer ? "Stop" : "Start"} Simulator
      </Button>
      {timer && (
        <p style={{ marginTop: 16, fontSize: 12 }}>
          Emitting every 4 s — open DevTools → Network → WebSocket to inspect.
        </p>
      )}
    </Card>
  );
}
