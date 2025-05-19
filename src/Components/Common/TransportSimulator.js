import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Input, Button, Slider, Card } from "antd";

/**
 * ❖ Pre-defined stopLogs – replace with prop / API if needed
 *    Only lat/lng are required for simulation.
 */
const stopLogs = [
  { lat: 19.133514, lng: 72.909211 }, // IIT Bombay
  { lat: 19.107076748950902, lng: 72.88816476798323 }, // Chandivali
  { lat: 19.067642588503425, lng: 72.92243391218042 }, // Shivaji Nagar
  { lat: 19.042151410952208, lng: 72.945691239305 }, // Cheeta Camp
];

const STEPS_PER_SEGMENT = 20; // resolution of interpolation
const EMIT_INTERVAL_MS = 4_000; // 4 s, matches backend loop

export default function TransportSimulator() {
  const [tripId, setTripId] = useState("6825fbff23879383d1f7cd48");
  const [speedKmh, setSpeedKmh] = useState(40);
  const [timer, setTimer] = useState(null);
  const [cursor, setCursor] = useState(0); // index into routePoints[]

  /** ❶ Compute equidistant way-points ONCE */
  const routePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < stopLogs.length - 1; i++) {
      const a = stopLogs[i];
      const b = stopLogs[i + 1];
      for (let step = 0; step < STEPS_PER_SEGMENT; step++) {
        const t = step / STEPS_PER_SEGMENT;
        pts.push({
          lat: a.lat + (b.lat - a.lat) * t,
          lng: a.lng + (b.lng - a.lng) * t,
        });
      }
    }
    // push the final stop
    pts.push(stopLogs[stopLogs.length - 1]);
    return pts;
  }, []);

  /** ❷ Memoised Socket.IO instance */
  const socket = useMemo(
    () =>
      io(process.env.REACT_APP_SOCKET_URL || "http://localhost:8080", {
        transports: ["websocket"],
        upgrade: false,
        path: "/socket.io",
      }),
    []
  );

  /** ❸ Start / Stop the simulation */
  const toggle = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      return;
    }
    if (!tripId) return alert("Enter tripId first!");

    // reset cursor on fresh run
    setCursor(0);

    const id = setInterval(() => {
      setCursor((idx) => {
        // Finished the route → auto-stop
        if (idx >= routePoints.length) {
          clearInterval(id);
          setTimer(null);
          return idx;
        }

        const { lat, lng } = routePoints[idx];
        socket.emit("location", {
          tripId,
          latitude: lat,
          longitude: lng,
          speed: speedKmh, // km/h → m/s (backend expects m/s)
        });
        // eslint-disable-next-line no-console
        console.log("📡 emit", lat, lng, speedKmh);

        return idx + 1;
      });
    }, EMIT_INTERVAL_MS);

    setTimer(id);
  };

  /** ❹ Clean up on unmount */
  useEffect(() => () => timer && clearInterval(timer), [timer]);

  return (
    <Card
      title="Transport Simulator"
      style={{ maxWidth: 420, margin: "40px auto" }}
    >
      <Input
        placeholder="Trip ObjectID"
        value={tripId}
        onChange={(e) => setTripId(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <div>Speed: {speedKmh} km/h</div>
      <Slider
        min={10}
        max={80}
        step={5}
        value={speedKmh}
        onChange={setSpeedKmh}
        style={{ marginBottom: 16 }}
      />

      <Button type={timer ? "danger" : "primary"} block onClick={toggle}>
        {timer ? "Stop" : "Start"} Simulator
      </Button>

      {timer && (
        <p style={{ marginTop: 16, fontSize: 12 }}>
          Emitting every {EMIT_INTERVAL_MS / 1000} s — open DevTools → Network →
          WebSocket to inspect.
        </p>
      )}
    </Card>
  );
}
