import {
  GoogleMap,
  Polyline,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const MapView = ({ trip, stops, currentLocation }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });
  if (!isLoaded) return null;

  // stops ⇒ [{ lat, lng }]
  const path = stops.map((s) => ({
    lat: s.stopId.location.lat,
    lng: s.stopId.location.lng,
  }));

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={currentLocation || path[0]}
      zoom={14}
    >
      <Polyline path={path} options={{ strokeWeight: 4 }} />
      {currentLocation && <Marker position={currentLocation} />}
    </GoogleMap>
  );
};

export default MapView;
