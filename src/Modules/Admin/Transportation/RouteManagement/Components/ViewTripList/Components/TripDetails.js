import React, { useState } from "react";
import { Card, Tag, Tooltip, Switch, Progress } from "antd";
import { MdTimelapse, MdSpeed } from "react-icons/md";
import {
  FaChartLine,
  FaInfoCircle,
  FaRoute,
  FaBus,
  FaClock,
  FaUsers,
  FaCrosshairs,
  CheckOutlined,
  CloseOutlined,
  AimOutlined,
} from "react-icons/fa";
import dayjs from "dayjs";
import StopTimeline from "./StopTimeline";

const TripDetails = ({
  trip,
  currentLocation,
  isGpsOn,
  stopStatusColor,
  stopStatusText,
  formatDuration,
  onToggleGps,
  fetchLocation,
}) => {
  const [isMapLoading, setIsMapLoading] = useState(true);

  /* --- stats --- */
  const realStops = trip.stopLogs.filter((s) => s.status !== "start_point");
  const completed = realStops.filter((s) => s.status === "completed").length;
  const progress = realStops.length
    ? Math.round((completed / realStops.length) * 100)
    : 0;

  return (
    <div className="p-6 h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="grid grid-cols-5 gap-6 h-full">
        {/* timeline */}
        <div className="col-span-3 h-full">
          <Card
            title={
              <div className="flex items-center">
                <MdTimelapse className="mr-2 text-indigo-600" />
                Trip Timeline
              </div>
            }
            extra={
              <div className="flex items-center gap-2">
                <AimOutlined className="text-indigo-600 text-lg" /> GPS
                <Tooltip title={isGpsOn ? "Turn off GPS" : "Turn on GPS"}>
                  <Switch
                    checked={isGpsOn}
                    onChange={(c) =>
                      onToggleGps({ tripId: trip._id, enable: c })
                    }
                  />
                </Tooltip>
              </div>
            }
            size="small"
            className="h-full shadow-lg border-0"
            bodyStyle={{
              height: "calc(100% - 56px)",
              overflow: "auto",
              padding: "16px 0",
            }}
          >
            <StopTimeline
              logs={trip.stopLogs}
              colourMap={stopStatusColor}
              textMap={stopStatusText}
            />
          </Card>
        </div>

        {/* right column */}
        <div className="col-span-2 space-y-6 h-full">
          <Card
            title={
              <div className="flex items-center">
                <FaChartLine className="mr-2 text-green-600" />
                Trip Progress
              </div>
            }
            size="small"
            className="shadow-lg border-0"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {completed}/{realStops.length} stops
                  </span>
                </div>
                <Progress
                  percent={progress}
                  strokeWidth={12}
                  status={
                    progress === 100
                      ? "success"
                      : trip.status === "in_progress"
                      ? "active"
                      : "normal"
                  }
                  strokeLinecap="round"
                  strokeColor={
                    progress === 100
                      ? "#10b981"
                      : trip.status === "in_progress"
                      ? "#3b82f6"
                      : "#8b5cf6"
                  }
                  trailColor="#e2e8f0"
                />
              </div>

              {/* GPS & vehicle status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">GPS Status</div>
                  <Tag
                    color={isGpsOn ? "green" : "red"}
                    icon={isGpsOn ? <CheckOutlined /> : <CloseOutlined />}
                  >
                    {isGpsOn ? "Active" : "Inactive"}
                  </Tag>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    Vehicle Status
                  </div>
                  <Tag
                    color={trip.vehicleStatus === "active" ? "green" : "orange"}
                  >
                    {trip.vehicleStatus === "active"
                      ? "Operational"
                      : "Maintenance"}
                  </Tag>
                </div>
              </div>

              {/* duration */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Duration</span>
                  <span className="text-sm font-semibold text-indigo-700">
                    {trip.startedAt && trip.endedAt
                      ? formatDuration(trip.startedAt, trip.endedAt)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* summary */}
          <Card
            title={
              <div className="flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Trip Summary
              </div>
            }
            size="small"
            className="shadow-lg border-0"
          >
            {/* route */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-4">
              <div className="text-xs text-gray-500 mb-1">Route</div>
              <div className="flex items-center">
                <FaRoute className="mr-2 text-blue-500" />
                <div>
                  <div className="text-sm font-semibold">
                    {trip.routeId?.routeName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {trip.tripType}
                  </div>
                </div>
              </div>
            </div>

            {/* live location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Live Location</div>
                <div className="flex items-center mb-2">
                  <FaBus className="mr-2 text-green-500" />
                  <div>
                    <div className="text-sm font-semibold">
                      {trip.vehicleId?.vehicleNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.vehicleId?.vehicleType} • {trip.vehicleId?.capacity}{" "}
                      seats
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Lat:</strong> {currentLocation?.lat || "—"}
                  <br />
                  <strong>Lng:</strong> {currentLocation?.lng || "—"}
                </div>
                <button
                  onClick={() =>
                    fetchLocation({ tripId: trip._id, enable: true })
                  }
                  className="flex items-center mt-2 px-3 py-1 bg-indigo-100 text-indigo-700
                                   text-xs rounded hover:bg-indigo-200"
                >
                  <FaCrosshairs className="mr-1" /> Fetch
                </button>
              </div>

              {/* map */}
              <div className="rounded-lg overflow-hidden shadow relative">
                {currentLocation ? (
                  <>
                    {isMapLoading && (
                      <div
                        className="absolute inset-0 flex items-center justify-center
                                                    bg-white bg-opacity-80 z-10 text-sm"
                      >
                        Loading…
                      </div>
                    )}
                    <iframe
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={() => setIsMapLoading(false)}
                      src={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed`}
                    />
                  </>
                ) : (
                  <div className="text-sm text-gray-500 p-4 text-center">
                    GPS inactive.
                  </div>
                )}
              </div>
            </div>

            {/* speed & halt */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {currentLocation?.speed ? "Live Speed" : "Default Speed"}
                </div>
                <div className="flex justify-center items-center">
                  <MdSpeed className="mr-1 text-purple-500" />
                  <span className="text-sm font-semibold">
                    {currentLocation?.speed
                      ? (currentLocation.speed * 3.6).toFixed(1)
                      : trip?.DEFAULT_SPEED_KMPH || "—"}{" "}
                    km/h
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Halt Time</div>
                <div className="flex justify-center items-center">
                  <FaClock className="mr-1 text-orange-500" />
                  <span className="text-sm font-semibold">
                    {trip.HALT_TIME_MINUTES || "—"} mins
                  </span>
                </div>
              </div>
            </div>

            {/* passengers */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mt-4">
              <div className="text-xs text-gray-500 mb-1">Passengers</div>
              <div className="flex items-center">
                <FaUsers className="mr-3 text-teal-500" />
                <div className="flex space-x-4">
                  <div>
                    <div className="text-sm font-semibold">
                      {trip.stopLogs.reduce(
                        (n, s) => n + (s.students?.length ?? 0),
                        0
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {trip.stopLogs.reduce(
                        (n, s) => n + (s.staffs?.length ?? 0),
                        0
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Staff</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
