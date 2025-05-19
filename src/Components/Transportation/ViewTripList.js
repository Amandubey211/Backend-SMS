import React, { useEffect, useState, useMemo } from "react";
import {
  FaClock,
  FaPlay,
  FaStop,
  FaMapMarkedAlt,
  FaHistory,
  FaCalendarAlt,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";
import { MdLocationOn, MdTimelapse } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  endTripLog,
  getTripLogsByVehicle,
  startTripLog,
} from "../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLog.action";
import {
  Tabs,
  Table,
  Tag,
  Space,
  Button,
  Badge,
  Popover,
  Empty,
  Input,
  DatePicker,
  Select,
  Modal,
  message,
  Spin,
  Alert,
  Card,
  Drawer /* ← added */,
} from "antd";
import {
  PlayCircleOutlined,
  StopOutlined,
  InfoCircleOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import advancedFormat from "dayjs/plugin/advancedFormat";
import MapView from "./MapView";
import Pagination from "../Common/pagination";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(advancedFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;

/* ---------- colour / text helpers ---------- */
const statusColor = {
  completed: "green",
  in_progress: "gold",
  pending: "orange",
  skipped: "red",
  cancelled: "gray",
};
const statusText = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
  skipped: "Skipped",
  cancelled: "Cancelled",
};

/* ========================================================================
   Trip-details live-tracking drawer
   ====================================================================== */
const TripDetailsSidebar = ({ trip, onClose }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  /* open socket only when drawer is visible */
  useEffect(() => {
    if (!trip?._id) return;

    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      path: "/socket.io",
    });
    setSocket(newSocket);

    /* initial fetch */
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/transport/trip/${trip._id}`);
        const data = await res.json();
        if (data.success) setCurrentLocation(data.currentLocation);
        else setError(data.message || "Failed to fetch trip data");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => newSocket.disconnect();
  }, [trip?._id]);

  /* live updates */
  useEffect(() => {
    if (!socket || !trip?._id) return;
    const handler = (data) => {
      if (data.tripId === trip._id) setCurrentLocation(data.location);
    };
    socket.on("location_update", handler);
    return () => socket.off("location_update", handler);
  }, [socket, trip?._id]);

  /* Drawer remains mounted, but visible toggles on trip */
  const visible = !!trip;

  return (
    <Drawer
      width="90%"
      onClose={onClose}
      open={visible}
      title={`Live Tracking: ${trip?.routeId?.routeName || "Trip"}`}
      destroyOnClose
    >
      {!trip ? null : loading ? (
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
                    {trip.status === "in_progress"
                      ? "Waiting for location data..."
                      : "Trip not started or completed"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </Drawer>
  );
};

/* ========================================================================
   Main list component
   ====================================================================== */
const ViewTripsList = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("today");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tripTypeFilter, setTripTypeFilter] = useState("all");
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);
  const [selectedTripForDetails, setSelectedTripForDetails] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    loading,
    vehicleWiseLogs = [],
    pagination = {},
  } = useSelector((s) => s.transportation.tripExecutionLog);

  const { vehicleId } = useParams();
  const dispatch = useDispatch();

  /* pagination helpers … (unchanged) */
  const handlePageChange = (page) =>
    dispatch(
      getTripLogsByVehicle({
        vehicleId,
        page,
        limit: pagination.limit,
        type: activeTab,
      })
    );

  const handleLimitChange = (limit) =>
    dispatch(
      getTripLogsByVehicle({
        vehicleId,
        page: 1,
        limit,
        type: activeTab,
      })
    );

  /* load trips on mount / tab change */
  useEffect(() => {
    dispatch(
      getTripLogsByVehicle({
        vehicleId,
        page: pagination?.currentPage,
        limit: pagination?.limit,
        type: activeTab,
      })
    );
  }, [vehicleId, activeTab, dispatch]);

  /* ---------- filters ---------- */
  const filteredTrips = useMemo(() => {
    let trips = vehicleWiseLogs;
    if (searchText)
      trips = trips.filter(
        (t) =>
          t.routeId?.routeName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          t.vehicleId?.vehicleNumber
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    if (dateRange?.length === 2)
      trips = trips.filter((t) =>
        dayjs(t.tripDate).isBetween(dateRange[0], dateRange[1], "day", "[]")
      );
    if (statusFilter !== "all")
      trips = trips.filter((t) => t.status === statusFilter);
    if (tripTypeFilter !== "all")
      trips = trips.filter((t) => t.tripType === tripTypeFilter);
    return trips;
  }, [vehicleWiseLogs, searchText, dateRange, statusFilter, tripTypeFilter]);

  const formatTime = (d) => (d ? dayjs(d).format("h:mm A") : "N/A");
  const formatDuration = (s, e) =>
    !s || !e
      ? "N/A"
      : (() => {
          const dur = dayjs.duration(dayjs(e).diff(dayjs(s)));
          return `${dur.minutes()}m ${dur.seconds()}s`;
        })();

  /* ---------- table columns ---------- */
  const columns = [
    /* Trip info, timing, stops … (unchanged code) */
    {
      title: "Trip Info",
      key: "tripInfo",
      render: (_, r) => (
        <div className="flex items-center">
          <Badge
            count={r.tripType === "pickup" ? "P" : "D"}
            style={{
              backgroundColor: r.tripType === "pickup" ? "#1890ff" : "#52c41a",
            }}
            title={r.tripType === "pickup" ? "Pickup" : "Drop"}
            className="mr-3"
          />
          <div>
            <div className="font-medium">
              {r.tripType === "pickup" ? "Pick Up" : "Drop Off"}
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(r.tripDate).format("MMM D, YYYY")}
            </div>
            {r.shiftId && (
              <div className="text-xs text-blue-600">
                {r.shiftId.shiftName} ({r.shiftId.fromTime}-{r.shiftId.toTime})
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Timing",
      key: "timing",
      render: (_, r) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <FaClock className="mr-1 text-gray-500" />
            <span>Scheduled: {formatTime(r.createdAt)}</span>
          </div>
          {r.startedAt && (
            <div className="flex items-center mt-1">
              <FaPlay className="mr-1 text-green-500" size={12} />
              <span>Started: {formatTime(r.startedAt)}</span>
            </div>
          )}
          {r.endedAt && (
            <div className="flex items-center mt-1">
              <FaStop className="mr-1 text-red-500" size={12} />
              <span>Ended: {formatTime(r.endedAt)}</span>
            </div>
          )}
          {r.startedAt && r.endedAt && (
            <div className="flex items-center mt-1">
              <MdTimelapse className="mr-1 text-blue-500" />
              <span>Duration: {formatDuration(r.startedAt, r.endedAt)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Stops",
      key: "stops",
      render: (_, r) => (
        <Popover
          content={
            <div className="max-h-60 overflow-y-auto pr-1">
              {r.stopLogs.map((s, i) => (
                <div key={i} className="flex items-start space-x-2 mb-2">
                  <MdLocationOn
                    className={`mt-1 ${
                      s.status === "completed"
                        ? "text-blue-500"
                        : s.status === "in_progress"
                        ? "text-yellow-500"
                        : s.status === "start_point"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-sm">
                      {s.stopId?.stopName || "Unknown Stop"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(s.scheduledArrival)}-
                      {formatTime(s.scheduledDeparture)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          trigger="hover"
        >
          <div className="flex items-center cursor-pointer hover:text-blue-600">
            <MdLocationOn className="mr-1 text-red-500" />
            <span className="text-sm font-medium">
              {r.stopLogs.filter((s) => s.status !== "skipped").length}/
              {r.stopLogs.length} stops
            </span>
          </div>
        </Popover>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={statusColor[s] || "default"} className="capitalize">
          {statusText[s] || s}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space size="middle">
          {r.status === "in_progress" ? (
            <Button
              type="primary"
              danger
              icon={<StopOutlined />}
              onClick={() => handleStop(r)}
              size="small"
              style={{ width: 100 }}
            >
              End
            </Button>
          ) : r.status === "not_started" ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStart(r)}
              size="small"
              style={{
                width: 100,
                backgroundColor: "green",
                borderColor: "green",
              }}
            >
              Start
            </Button>
          ) : (
            <Button
              type="dashed"
              icon={<StopOutlined />}
              disabled
              size="small"
              style={{ width: 100 }}
            >
              Ended
            </Button>
          )}

          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setSelectedTripForDetails(r)}
            size="small"
            style={{ width: 100 }}
          >
            Details
          </Button>
          <Button
            icon={<FaMapMarkedAlt />}
            onClick={() => {
              setSelectedTripForMap(r);
              setShowMapModal(true);
            }}
            size="small"
            style={{ width: 100 }}
          >
            Map
          </Button>
        </Space>
      ),
    },
  ];

  /* ---------- start / stop handlers ---------- */
  const handleStart = (trip) =>
    Modal.confirm({
      title: "Confirm Start Trip",
      icon: <ExclamationOutlined />,
      content: `Start the ${trip.tripType} trip for ${trip.routeId?.routeName}?`,
      okText: "Start Trip",
      onOk: () => {
        setConfirmLoading(true);
        dispatch(startTripLog({ tripId: trip._id, vehicleId })).finally(() =>
          setConfirmLoading(false)
        );
      },
    });

  const handleStop = (trip) =>
    Modal.confirm({
      title: "Confirm End Trip",
      icon: <ExclamationOutlined />,
      content: `End the ${trip.tripType} trip for ${trip.routeId?.routeName}?`,
      okText: "End Trip",
      okButtonProps: { danger: true },
      onOk: () => {
        setConfirmLoading(true);
        dispatch(endTripLog({ tripId: trip._id, vehicleId }))
          .then(() => message.success(`Trip ${trip._id} ended successfully`))
          .finally(() => setConfirmLoading(false));
      },
    });

  /* ---------- render ---------- */
  return (
    <div className="p-6">
      {/* filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Search trips…"
          prefix={<FaSearch className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <RangePicker
          className="w-full"
          onChange={setDateRange}
          disabledDate={(c) => c && c > dayjs().endOf("day")}
        />
        <Select
          className="w-full"
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          allowClear
        >
          {[
            "all",
            "pending",
            "in_progress",
            "completed",
            "skipped",
            "cancelled",
          ].map((s) => (
            <Option key={s} value={s}>
              {s === "all" ? "All Statuses" : statusText[s]}
            </Option>
          ))}
        </Select>
        <Select
          className="w-full"
          value={tripTypeFilter}
          onChange={setTripTypeFilter}
          placeholder="Filter by trip type"
          allowClear
        >
          <Option value="all">All Types</Option>
          <Option value="pickup">Pickup</Option>
          <Option value="drop">Drop</Option>
        </Select>
      </div>

      {/* table tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        animated={{ inkBar: true, tabPane: true }}
      >
        <Tabs.TabPane
          key="today"
          tab={
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1" /> Today's Trips
            </span>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredTrips.filter((t) =>
              dayjs(t.tripDate).isSame(dayjs(), "day")
            )}
            rowKey="_id"
            pagination={false}
            loading={loading || confirmLoading}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No trips scheduled for today"
                />
              ),
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="history"
          tab={
            <span className="flex items-center">
              <FaHistory className="mr-1" /> Trip History
            </span>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredTrips.filter(
              (t) => !dayjs(t.tripDate).isSame(dayjs(), "day")
            )}
            rowKey="_id"
            pagination={false}
            loading={loading}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No historical trips found"
                />
              ),
            }}
          />
        </Tabs.TabPane>
      </Tabs>

      {/* live-tracking drawer */}
      <TripDetailsSidebar
        trip={selectedTripForDetails}
        onClose={() => setSelectedTripForDetails(null)}
      />

      {/* map modal */}
      <Modal
        title={`Route Map: ${selectedTripForMap?.routeId?.routeName || "Trip"}`}
        open={showMapModal}
        onCancel={() => setShowMapModal(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
      >
        {selectedTripForMap && (
          <div style={{ height: "70vh" }}>
            <MapView
              trip={selectedTripForMap}
              stops={selectedTripForMap.stopLogs}
            />
          </div>
        )}
      </Modal>

      {!!vehicleWiseLogs.length && (
        <Pagination
          page={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalItems}
          limit={pagination.limit}
          setPage={handlePageChange}
          setLimit={handleLimitChange}
          t={t}
        />
      )}
    </div>
  );
};

export default ViewTripsList;
