// src/utils/simulateLocation.js
export const simulateTripMovement = (tripId, route, interval = 5000) => {
  const socket = getSocket();
  let currentStopIndex = 0;
  let isMoving = true;

  const stops = route.stopLogs
    .map((log) => ({
      ...log.stopId.location,
      order: log.order,
    }))
    .sort((a, b) => a.order - b.order);

  const simulate = () => {
    if (currentStopIndex >= stops.length) {
      currentStopIndex = 0;
    }

    const nextStopIndex = (currentStopIndex + 1) % stops.length;
    const currentStop = stops[currentStopIndex];
    const nextStop = stops[nextStopIndex];

    // Simple linear interpolation between stops
    let lat = currentStop.lat;
    let lng = currentStop.lng;
    const speed = isMoving ? 10 + Math.random() * 10 : 0; // km/h

    if (isMoving) {
      lat = lat + (nextStop.lat - lat) * 0.1;
      lng = lng + (nextStop.lng - lng) * 0.1;

      // If we're close to the next stop, "arrive"
      if (
        Math.abs(lat - nextStop.lat) < 0.0001 &&
        Math.abs(lng - nextStop.lng) < 0.0001
      ) {
        isMoving = false;
        setTimeout(() => {
          isMoving = true;
          currentStopIndex = nextStopIndex;
        }, 2000); // Wait 2 seconds at the stop
      }
    }

    socket.emit("locationUpdate", {
      tripId,
      lat,
      lng,
      speed,
      timestamp: new Date(),
    });
  };

  const intervalId = setInterval(simulate, interval);

  return () => clearInterval(intervalId);
};
