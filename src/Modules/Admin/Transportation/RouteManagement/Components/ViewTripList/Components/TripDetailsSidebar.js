import React, { useState, useEffect } from "react";
import { MdLocationOn } from "react-icons/md";
import { Card, Tag, Spin, Alert } from "antd";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import Sidebar from "../Common/Sidebar";

const TripDetailsSidebar = ({
  showDetailsSidebar,
  setShowDetailsSidebar,
  selectedTripForDetails: trip,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Socket connection for real-time updates
  useEffect(() => {
    if (!trip?._id) return;

    const socket = io("http://localhost:8080", {
      transports: ["websocket"],
      path: "/socket.io",
    });

    socket.on("location_update", (data) => {
      if (data.tripId === trip._id) {
        setCurrentLocation(data.location);
      }
    });

    return () => socket.disconnect();
  }, [trip?._id]);

  // Fetch initial location data
  useEffect(() => {
    if (!trip?._id) return;

    setLoading(true);
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/transport/trip/${trip._id}`);
        const data = await response.json();

        if (data.success) {
          setCurrentLocation(data.currentLocation);
        } else {
          setError(data.message || "Failed to fetch trip data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [trip?._id]);

  if (!trip) return null;

  return (
    <Sidebar
      isOpen={showDetailsSidebar}
      onClose={() => setShowDetailsSidebar(false)}
      width="90%"
      title={`Live Tracking: ${trip.routeId?.routeName || "Trip"}`}
    >
      <div className="p-6 h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin tip="Loading trip data..." size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Card
            title={
              <div className="flex items-center">
                <MdLocationOn className="mr-2 text-blue-600" />
                <span className="font-semibold text-gray-800">
                  Vehicle Position
                </span>
                {currentLocation && (
                  <Tag color="green" className="ml-2">
                    LIVE
                  </Tag>
                )}
              </div>
            }
            className="h-full"
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="text-sm mb-2">
                  <strong>Latitude:</strong>{" "}
                  {currentLocation?.lat?.toFixed(6) || "N/A"}
                </div>
                <div className="text-sm mb-2">
                  <strong>Longitude:</strong>{" "}
                  {currentLocation?.lng?.toFixed(6) || "N/A"}
                </div>
                <div className="text-sm">
                  <strong>Last Update:</strong>{" "}
                  {currentLocation?.timestamp
                    ? dayjs(currentLocation.timestamp).fromNow()
                    : "N/A"}
                </div>
              </div>

              <div className="flex-1 rounded-lg overflow-hidden relative border">
                {currentLocation ? (
                  <>
                    {isMapLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                        <span className="text-sm text-gray-500 animate-pulse">
                          Loading map...
                        </span>
                      </div>
                    )}
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={() => setIsMapLoading(false)}
                      src={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed`}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      Waiting for location data...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </Sidebar>
  );
};

export default TripDetailsSidebar;
