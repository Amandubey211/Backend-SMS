import React from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Leaflet for OpenStreetMap
import 'leaflet/dist/leaflet.css';

const sampleStops = [
  { id: 1, name: 'Stop 1', lat: 28.7041, lng: 77.1025 },
  { id: 2, name: 'Stop 2', lat: 28.7050, lng: 77.1080 },
  { id: 3, name: 'Stop 3', lat: 28.7065, lng: 77.1150 },
  // ... More stops
];

const StoppageList = () => {
  const { id } = useParams(); // routeId आएगा URL से

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stoppages for Route {id}</h2>

      <div className="h-[500px] w-full mb-6">
        <MapContainer center={[28.7041, 77.1025]} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-lg">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sampleStops.map((stop) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]}>
              <Popup>
                {stop.name}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Stops List */}
      <ul className="space-y-2">
        {sampleStops.map((stop) => (
          <li key={stop.id} className="p-2 border rounded-md bg-gray-100">
            {stop.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoppageList;
