// src/transportation/components/LiveMapView.js
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useTripLocationSocket } from "../../hooks/useTripLocationSocket";

const LiveMapView = ({ trip, stops }) => {
  const [path, setPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useTripLocationSocket(trip._id, (data) => {
    setCurrentLocation(data.location);
    setPath((prev) => [...prev.slice(-100), data.location]); // Keep last 100 points
  });

  const stopMarkers = stops.map((stop) => ({
    position: stop.stopId.location,
    label: String(stop.order),
    status: stop.status,
  }));

  return (
    <GoogleMap
      mapContainerStyle={{ height: "500px", width: "100%" }}
      center={currentLocation || stopMarkers[0]?.position}
      zoom={14}
    >
      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={{
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            rotation: 0, // You can calculate bearing from path
          }}
        />
      )}

      {stopMarkers.map((marker, i) => (
        <Marker
          key={i}
          position={marker.position}
          label={marker.label}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getStatusColor(marker.status),
            fillOpacity: 1,
            strokeWeight: 2,
          }}
        />
      ))}

      {path.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: "#4285F4",
            strokeOpacity: 1,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
};

function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "#0F9D58";
    case "in_progress":
      return "#F4B400";
    case "pending":
      return "#DB4437";
    default:
      return "#9E9E9E";
  }
}

export default LiveMapView;
