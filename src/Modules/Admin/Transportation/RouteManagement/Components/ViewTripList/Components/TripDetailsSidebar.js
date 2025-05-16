// TripDetailsSidebar.jsx
import React, { useState } from "react";
import {
  FaChartLine,
  FaClock,
  FaRoute,
  FaBus,
  FaInfoCircle,
  FaCrosshairs,
  FaUsers,
} from "react-icons/fa";
import { MdTimelapse, MdSpeed, MdLocationOn } from "react-icons/md";
import { Card, Tag, Tooltip, Switch, Progress, Timeline } from "antd";
import { AimOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Sidebar from "../Common/Sidebar";
import { setIsGpsOn } from "../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLogSlice";

dayjs.extend(duration);

/* ------------------------------------------------------------------ */
/* 🛠️  Small helpers & constants                                      */
/* ------------------------------------------------------------------ */

const stopStatusColor = {
  start_point: "green",
  pending: "orange",
  skipped: "red",
  completed: "blue",
  in_progress: "gold",
};

const stopStatusText = {
  start_point: "Start Point",
  pending: "Pending",
  skipped: "Skipped",
  completed: "Completed",
  in_progress: "In Progress",
};

const formatDateTime = (d) =>
  d ? dayjs(d).format("ddd, MMM D [•] h:mm A") : "Not scheduled";

const formatDuration = (start, end) => {
  if (!start || !end) return "N/A";
  const diff = dayjs.duration(dayjs(end).diff(dayjs(start)));
  return `${diff.minutes()}m ${diff.seconds()}s`;
};

/* ------------------------------------------------------------------ */
/* 🚀  Component                                                      */
/* ------------------------------------------------------------------ */

const TripDetailsSidebar = ({
  showDetailsSidebar,
  setShowDetailsSidebar,
  selectedTripForDetails: trip,
  currentLocation,
  isGpsOn,
  dispatch,
  fetchCurrentLocation, // pass the parent’s handler down
}) => {
  const [isMapLoading, setIsMapLoading] = useState(true);

  /* ---------------- Render helpers ---------------- */
  const StopLogsTimeline = ({ stopLogs }) => (
    <Timeline mode="left" className="custom-timeline">
      {stopLogs.map((log) => (
        <Timeline.Item
          key={log._id || log.order}
          color={stopStatusColor[log.status] || "gray"}
          dot={
            <div className="timeline-dot-container">
              <div className={`timeline-dot ${log.status}-dot`} />
            </div>
          }
          label={
            <div className="timeline-label bg-white p-3 rounded-lg shadow-xs border border-gray-100">
              <div className="font-semibold text-gray-800 flex items-center">
                <span className="stop-order mr-2 bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {log.order}
                </span>
                {log.stopId?.stopName}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Scheduled:</span>{" "}
                {formatDateTime(log.scheduledArrival)} →{" "}
                {formatDateTime(log.scheduledDeparture)}
              </div>
            </div>
          }
        >
          <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-100 ml-4">
            <Tag
              color={stopStatusColor[log.status]}
              className="!font-medium !text-sm !px-3 !py-1 !rounded-full mb-2"
            >
              {stopStatusText[log.status]}
            </Tag>

            {!log.actualArrival && (
              <div className="text-sm text-red-500 font-medium mb-2">
                Pending arrival
              </div>
            )}

            {log.actualArrival && (
              <InfoRow
                label="Arrived"
                value={formatDateTime(log.actualArrival)}
              />
            )}
            {log.actualDeparture && (
              <InfoRow
                label="Departed"
                value={formatDateTime(log.actualDeparture)}
              />
            )}
            {log.notes && <InfoRow label="Notes" value={log.notes} />}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );

  const InfoRow = ({ label, value }) => (
    <div className="text-sm mb-1">
      <span className="text-gray-600 font-medium">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );

  /* ---------------- Main render ---------------- */
  if (!trip) return null;

  // Progress %
  const actualStops = trip.stopLogs.filter((s) => s.status !== "start_point");
  const completedStops = actualStops.filter(
    (s) => s.status === "completed"
  ).length;
  const totalStops = actualStops.length;
  const progressPercent = !totalStops
    ? 0
    : Math.round((completedStops / totalStops) * 100);

  return (
    <Sidebar
      isOpen={showDetailsSidebar}
      onClose={() => setShowDetailsSidebar(false)}
      width="90%"
      title={`Trip Details: ${trip.routeId?.routeName || "Trip"}`}
    >
      <div className="p-6 h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="grid grid-cols-5 gap-6 h-full">
          {/* ---------- Timeline column ---------- */}
          <div className="col-span-3 h-full">
            <Card
              title={
                <Header icon={MdTimelapse} text="Trip Timeline" tint="indigo" />
              }
              extra={
                <div className="flex items-center gap-2">
                  <AimOutlined className="text-indigo-600 text-lg" /> GPS
                  <Tooltip title={isGpsOn ? "Turn off GPS" : "Turn on GPS"}>
                    <Switch
                      checked={isGpsOn}
                      onChange={(checked) => dispatch(setIsGpsOn(checked))}
                    />
                  </Tooltip>
                </div>
              }
              size="small"
              className="h-full shadow-lg border-0"
              headStyle={{ borderBottom: "1px solid #e2e8f0" }}
              bodyStyle={{
                height: "calc(100% - 56px)",
                overflow: "auto",
                padding: "16px 0",
              }}
            >
              <StopLogsTimeline stopLogs={trip.stopLogs} />
            </Card>
          </div>

          {/* ---------- Right-hand column ---------- */}
          <div className="col-span-2 space-y-6 h-full">
            {/* --- Progress --- */}
            <Card
              title={
                <Header icon={FaChartLine} text="Trip Progress" tint="green" />
              }
              size="small"
              className="shadow-lg border-0"
            >
              <ProgressSection
                progressPercent={progressPercent}
                completedStops={completedStops}
                totalStops={totalStops}
                isGpsOn={isGpsOn}
                vehicleStatus={trip.vehicleStatus}
                trip={trip}
              />
            </Card>

            {/* --- Summary --- */}
            <Card
              title={
                <Header icon={FaInfoCircle} text="Trip Summary" tint="blue" />
              }
              size="small"
              className="shadow-lg border-0"
            >
              <SummarySection
                trip={trip}
                currentLocation={currentLocation}
                isMapLoading={isMapLoading}
                setIsMapLoading={setIsMapLoading}
                fetchCurrentLocation={fetchCurrentLocation}
              />
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

/* ------------------------------------------------------------------ */
/* 🍏  Smaller sub-components                                         */
/* ------------------------------------------------------------------ */

const Header = ({ icon: Icon, text, tint }) => (
  <div className="flex items-center">
    <Icon className={`mr-2 text-${tint}-600`} />
    <span className="font-semibold text-gray-800">{text}</span>
  </div>
);

const ProgressSection = ({
  progressPercent,
  completedStops,
  totalStops,
  isGpsOn,
  vehicleStatus,
  trip,
}) => (
  <div className="space-y-4">
    {/* Completion bar */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Completion</span>
        <span className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          {completedStops}/{totalStops} stops
        </span>
      </div>
      <Progress
        percent={progressPercent}
        strokeWidth={12}
        strokeLinecap="round"
        status={
          progressPercent === 100
            ? "success"
            : trip.status === "in_progress"
            ? "active"
            : "normal"
        }
        strokeColor={
          progressPercent === 100
            ? "#10b981"
            : trip.status === "in_progress"
            ? "#3b82f6"
            : "#8b5cf6"
        }
        trailColor="#e2e8f0"
        className="mb-1"
      />
    </div>

    {/* GPS & Vehicle status */}
    <div className="grid grid-cols-2 gap-3">
      <StatusCard
        title="GPS Status"
        ok={isGpsOn}
        okText="Active"
        failText="Inactive"
      />
      <StatusCard
        title="Vehicle Status"
        ok={vehicleStatus === "active"}
        okText="Operational"
        failText="Maintenance"
      />
    </div>

    {/* Duration */}
    <InfoCard title="Duration">
      {trip.startedAt && trip.endedAt
        ? formatDuration(trip.startedAt, trip.endedAt)
        : "N/A"}
    </InfoCard>

    {/* Optional trip notes */}
    {trip.notes && (
      <InfoCard title="Trip Notes">
        <span className="text-sm">{trip.notes}</span>
      </InfoCard>
    )}
  </div>
);

const SummarySection = ({
  trip,
  currentLocation,
  isMapLoading,
  setIsMapLoading,
  fetchCurrentLocation,
}) => (
  <div className="space-y-4">
    {/* Route info */}
    <InfoCard title="Route Details">
      <div className="flex items-center">
        <FaRoute className="mr-3 text-blue-500 text-lg" />
        <div>
          <div className="text-sm font-semibold text-gray-800">
            {trip.routeId?.routeName || "N/A"}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {trip.tripType === "pickup" ? "Morning Pickup" : "Afternoon Drop"}
          </div>
        </div>
      </div>
    </InfoCard>

    {/* Live location & map */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard title="Live Location of vehicle">
        <div className="flex items-center mb-2">
          <FaBus className="mr-3 text-green-500 text-lg" />
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {trip.vehicleId?.vehicleNumber || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {trip.vehicleId?.vehicleType || "N/A"} •{" "}
              {trip.vehicleId?.capacity || "N/A"} seats
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          <strong>Latitude:</strong> {currentLocation?.lat || "N/A"}
          <br />
          <strong>Longitude:</strong> {currentLocation?.lng || "N/A"}
        </div>

        <div className="flex justify-end mt-2">
          <button
            onClick={() =>
              fetchCurrentLocation({ tripId: trip._id, enable: true })
            }
            className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-200 transition"
          >
            <FaCrosshairs className="mr-1" />
            Fetch Location
          </button>
        </div>
      </InfoCard>

      <div className="rounded-lg overflow-hidden shadow mt-3 relative">
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
              height="200"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoading(false)}
              src={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed`}
            />
          </>
        ) : (
          <div className="text-sm text-gray-500 p-4 text-center">
            Location not available or GPS is off.
          </div>
        )}
      </div>
    </div>

    {/* Speed & halt time */}
    <div className="grid grid-cols-2 gap-3">
      <InfoCard title={currentLocation?.speed ? "Live Speed" : "Default Speed"}>
        <div className="flex items-center">
          <MdSpeed className="mr-2 text-purple-500 text-lg" />
          <span className="text-sm font-semibold text-gray-800">
            {currentLocation?.speed
              ? (currentLocation.speed * 3.6).toFixed(1)
              : trip.DEFAULT_SPEED_KMPH || "N/A"}{" "}
            km/h
          </span>
        </div>
      </InfoCard>

      <InfoCard title="Halt Time">
        <div className="flex items-center">
          <FaClock className="mr-2 text-orange-500" />
          <span className="text-sm font-semibold text-gray-800">
            {trip.HALT_TIME_MINUTES || "N/A"} mins
          </span>
        </div>
      </InfoCard>
    </div>

    {/* Passenger counts */}
    <InfoCard title="Passengers">
      <div className="flex items-center">
        <FaUsers className="mr-3 text-teal-500 text-lg" />
        <div className="flex space-x-4">
          <PassengerCount
            label="Students"
            count={trip.stopLogs.reduce(
              (sum, s) => sum + (s.students?.length || 0),
              0
            )}
          />
          <PassengerCount
            label="Staff"
            count={trip.stopLogs.reduce(
              (sum, s) => sum + (s.staffs?.length || 0),
              0
            )}
          />
        </div>
      </div>
    </InfoCard>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
    <div className="text-xs font-medium text-gray-500 mb-1">{title}</div>
    {children}
  </div>
);

const StatusCard = ({ title, ok, okText, failText }) => (
  <InfoCard title={title}>
    <Tag
      color={ok ? "green" : "red"}
      icon={ok ? <CheckOutlined /> : <CloseOutlined />}
      className="w-full text-center font-medium shadow-sm"
    >
      {ok ? okText : failText}
    </Tag>
  </InfoCard>
);

const PassengerCount = ({ label, count }) => (
  <div>
    <div className="text-sm font-semibold text-gray-800">{count}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default TripDetailsSidebar;
