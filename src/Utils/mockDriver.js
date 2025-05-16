// // scripts/mockDriver.js
// import { io } from "socket.io-client";

// const socket = io("http://localhost:8000/transport", {
//   transports: ["websocket"],
// });
// const tripId = "663e5cc9f7c5a5d3c2e410fa";

// socket.on("connect", () => {
//   console.log("🚚 mock driver connected", socket.id);

//   // Somewhere in city centre
//   let lat = 25.276987;
//   let lng = 51.520046;

//   setInterval(() => {
//     // jiggle the coordinates a tiny bit
//     lat += (Math.random() - 0.5) * 0.0004;
//     lng += (Math.random() - 0.5) * 0.0004;
//     const speed = 40; // km/h → backend converts anyway

//     socket.emit("location", { tripId, latitude: lat, longitude: lng, speed });
//   }, 3000);
// });
