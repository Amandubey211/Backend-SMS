import React, { useMemo, useState, useEffect } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import {
  FaMapMarkerAlt,
  FaFlag,
  FaBus,
  FaCrosshairs,
  FaSearchPlus,
  FaSearchMinus,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const stopStatusText = {
  start_point: "Start Point",
  pending: "Pending",
  skipped: "Skipped",
  completed: "Completed",
  in_progress: "In Progress",
};

const statusText = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

const statusColor = {
  completed: "#52c41a",
  in_progress: "#faad14",
  pending: "#fa8c16",
  skipped: "#f5222d",
  cancelled: "#d9d9d9",
};

const stopStatusColor = {
  start_point: "#52c41a",
  pending: "#fa8c16",
  skipped: "#f5222d",
  completed: "#1890ff",
  in_progress: "#faad14",
};

const MapView = ({ trip, stops }) => {
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState([19.133514, 72.909211]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [followVehicle, setFollowVehicle] = useState(false);

  // Process stops data
  const processedStops = useMemo(() => {
    if (!stops) return [];
    return stops
      .filter((stop) => stop.stopId?.location)
      .map((stop) => ({
        ...stop,
        position: [stop.stopId.location.lat, stop.stopId.location.lng],
      }));
  }, [stops]);

  // Vehicle position simulation
  const [vehiclePosition, setVehiclePosition] = useState(null);
  useEffect(() => {
    if (!processedStops.length) return;

    setVehiclePosition(processedStops[0].position);

    if (followVehicle && trip.status === "in_progress") {
      const interval = setInterval(() => {
        setVehiclePosition((prev) => {
          if (!prev) return processedStops[0].position;
          const currentIndex = processedStops.findIndex(
            (stop) =>
              stop.position[0] === prev[0] && stop.position[1] === prev[1]
          );
          const nextIndex = (currentIndex + 1) % processedStops.length;
          return processedStops[nextIndex].position;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [followVehicle, processedStops, trip.status]);

  // Set initial view to show all stops
  useEffect(() => {
    if (processedStops.length > 0) {
      const coordinates = processedStops.map((stop) => stop.position);
      setCenter(calculateCenter(coordinates));
    }
  }, [processedStops]);

  const calculateCenter = (coordinates) => {
    if (!coordinates.length) return [19.133514, 72.909211];

    let minLat = coordinates[0][0];
    let maxLat = coordinates[0][0];
    let minLng = coordinates[0][1];
    let maxLng = coordinates[0][1];

    coordinates.forEach((coord) => {
      minLat = Math.min(minLat, coord[0]);
      maxLat = Math.max(maxLat, coord[0]);
      minLng = Math.min(minLng, coord[1]);
      maxLng = Math.max(maxLng, coord[1]);
    });

    return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  };

  const handleStopClick = (stop) => {
    setSelectedStop(stop);
    setCenter(stop.position);
    setZoom(14);
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 1, 18));
  const handleZoomOut = () => setZoom(Math.max(zoom - 1, 10));
  const toggleFollowVehicle = () => setFollowVehicle(!followVehicle);

  const getStopColor = (stop) => stopStatusColor[stop.status] || "#d9d9d9";
  const getStopIcon = (stop) =>
    stop.status === "start_point" ? <FaFlag /> : <FaMapMarkerAlt />;

  // Route path component
  const RoutePath = ({ stops }) => (
    <Overlay anchor={[0, 0]} offset={[0, 0]}>
      {(map) => {
        if (!stops || stops.length < 2) return null;

        const points = stops.map((stop) =>
          map.project([stop.position[0], stop.position[1]])
        );

        return (
          <svg
            width={map.width}
            height={map.height}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <polyline
              points={points
                .map((point) => `${point[0]},${point[1]}`)
                .join(" ")}
              fill="none"
              stroke="#1890ff"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          </svg>
        );
      }}
    </Overlay>
  );

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* Map Controls */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          backgroundColor: "white",
          padding: 8,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <button onClick={handleZoomIn} style={mapControlButtonStyle}>
          <FaSearchPlus />
        </button>
        <div
          style={{ height: 1, backgroundColor: "#f0f0f0", margin: "4px 0" }}
        />
        <button onClick={handleZoomOut} style={mapControlButtonStyle}>
          <FaSearchMinus />
        </button>
        <div
          style={{ height: 1, backgroundColor: "#f0f0f0", margin: "4px 0" }}
        />
        <button
          onClick={toggleFollowVehicle}
          style={{
            ...mapControlButtonStyle,
            color: followVehicle ? "#1890ff" : "#666",
          }}
        >
          <FaCrosshairs />
        </button>
      </div>

      {/* Map */}
      <div style={{ height: "100%", position: "relative" }}>
        <Map
          center={center}
          zoom={zoom}
          onBoundsChanged={({ center, zoom }) => {
            if (!followVehicle) {
              setCenter(center);
              setZoom(zoom);
            }
          }}
          height="100%"
          metaWheelZoom
          touchEvents
        >
          <RoutePath stops={processedStops} />

          {/* Stops Markers */}
          {processedStops.map((stop, index) => (
            <Marker
              key={`${stop.stopId?._id || index}`}
              anchor={stop.position}
              payload={stop}
              onClick={({ payload }) => handleStopClick(payload)}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                style={{ cursor: "pointer" }}
              >
                <div style={{ position: "relative" }}>
                  <div style={stopOrderBadgeStyle(getStopColor(stop))}>
                    {stop.order}
                  </div>
                  <div
                    style={stopMarkerStyle(getStopColor(stop))}
                    title={stop.stopId?.stopName}
                  >
                    {getStopIcon(stop)}
                  </div>
                </div>
              </motion.div>
            </Marker>
          ))}

          {/* Vehicle Marker */}
          {vehiclePosition && (
            <Marker anchor={vehiclePosition}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <div
                  style={vehicleMarkerStyle}
                  title={`Vehicle ${trip.vehicleId?.vehicleNumber || ""}`}
                >
                  <FaBus />
                </div>
              </motion.div>
            </Marker>
          )}

          {/* Selected Stop Highlight */}
          {selectedStop && (
            <Overlay anchor={selectedStop.position} offset={[0, 0]}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={selectedStopHighlightStyle}
              />
            </Overlay>
          )}
        </Map>
      </div>

      {/* Selected Stop Info Panel */}
      {selectedStop && (
        <div style={infoPanelStyle}>
          <div style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={stopIconStyle(getStopColor(selectedStop))}>
                {getStopIcon(selectedStop)}
              </div>
              <h3 style={{ margin: 0 }}>
                {selectedStop.stopId?.stopName || "Unknown Stop"}
              </h3>
            </div>

            <Divider />

            <InfoGrid
              items={[
                {
                  label: "Status",
                  value: (
                    <span style={statusBadgeStyle(getStopColor(selectedStop))}>
                      {stopStatusText[selectedStop.status] ||
                        selectedStop.status}
                    </span>
                  ),
                },
                { label: "Order", value: selectedStop.order },
                {
                  label: "Scheduled Arrival",
                  value: selectedStop.scheduledArrival || "N/A",
                },
                {
                  label: "Actual Arrival",
                  value: selectedStop.actualArrival || "Not arrived",
                },
                ...(selectedStop.notes
                  ? [{ label: "Notes", value: selectedStop.notes }]
                  : []),
                {
                  label: "Location",
                  value: `${selectedStop.position[0].toFixed(
                    6
                  )}, ${selectedStop.position[1].toFixed(6)}`,
                },
              ]}
            />

            {selectedStop.students?.length > 0 && (
              <>
                <Divider
                  text={
                    <>
                      <FaUsers style={{ marginRight: 8 }} /> Students (
                      {selectedStop.students.length})
                    </>
                  }
                />
              </>
            )}

            {selectedStop.staffs?.length > 0 && (
              <>
                <Divider
                  text={
                    <>
                      <FaUser style={{ marginRight: 8 }} /> Staff (
                      {selectedStop.staffs.length})
                    </>
                  }
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Trip Info Panel */}
      <div style={{ ...infoPanelStyle, top: 16, left: 16 }}>
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: 0, marginBottom: 12 }}>
            {trip.routeId?.routeName || "Trip Details"}
          </h3>
          <Divider />

          <InfoGrid
            items={[
              {
                label: "Vehicle",
                value: `${trip.vehicleId?.vehicleNumber || "N/A"} (${
                  trip.vehicleId?.vehicleType || "N/A"
                })`,
              },
              {
                label: "Trip Type",
                value:
                  trip.tripType === "pickup"
                    ? "Morning Pickup"
                    : "Afternoon Drop",
              },
              {
                label: "Date",
                value: dayjs(trip.tripDate).format("MMM D, YYYY"),
              },
              {
                label: "Status",
                value: (
                  <span style={statusBadgeStyle(statusColor[trip.status])}>
                    {statusText[trip.status] || trip.status}
                  </span>
                ),
              },
              ...(trip.startedAt
                ? [
                    {
                      label: "Started At",
                      value: dayjs(trip.startedAt).format("h:mm A"),
                    },
                  ]
                : []),
              ...(trip.endedAt
                ? [
                    {
                      label: "Ended At",
                      value: dayjs(trip.endedAt).format("h:mm A"),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// Helper components
const Divider = ({ text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      margin: "12px 0",
      color: "#666",
    }}
  >
    <div style={{ flex: 1, height: 1, backgroundColor: "#f0f0f0" }} />
    {text && <div style={{ padding: "0 8px" }}>{text}</div>}
    {text && <div style={{ flex: 1, height: 1, backgroundColor: "#f0f0f0" }} />}
    {!text && (
      <div style={{ width: "100%", height: 1, backgroundColor: "#f0f0f0" }} />
    )}
  </div>
);

const InfoGrid = ({ items }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "100px 1fr",
      gap: "8px 12px",
    }}
  >
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <div style={{ color: "#666" }}>{item.label}:</div>
        <div>{item.value}</div>
      </React.Fragment>
    ))}
  </div>
);

// Style objects
const mapControlButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 4,
  fontSize: 16,
  color: "#1890ff",
};

const stopOrderBadgeStyle = (color) => ({
  position: "absolute",
  top: -10,
  right: -10,
  backgroundColor: color,
  color: "white",
  borderRadius: "50%",
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 10,
  fontWeight: "bold",
});

const stopMarkerStyle = (color) => ({
  backgroundColor: color,
  color: "white",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const vehicleMarkerStyle = {
  backgroundColor: "#faad14",
  color: "white",
  borderRadius: "50%",
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const selectedStopHighlightStyle = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#1890ff",
  opacity: 0.3,
  position: "absolute",
  transform: "translate(-50%, -50%)",
};

const infoPanelStyle = {
  position: "absolute",
  zIndex: 1000,
  width: 300,
  maxHeight: "40vh",
  overflow: "auto",
  backgroundColor: "white",
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
};

const stopIconStyle = (color) => ({
  backgroundColor: color,
  color: "white",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
});

const statusBadgeStyle = (color) => ({
  display: "inline-block",
  padding: "2px 8px",
  backgroundColor: color,
  color: "white",
  borderRadius: 4,
  fontSize: 12,
});

export default MapView;
