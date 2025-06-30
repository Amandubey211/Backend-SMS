import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
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
  Spin,
  Alert,
  Card,
  Drawer,
  Tabs,
  message,
  Tooltip,
} from "antd";
import {
  FaClock,
  FaMapMarkedAlt,
  FaHistory,
  FaCalendarAlt,
  FaSearch,
  FaPlay,
  FaStop,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdTimelapse,
  MdDirectionsBus,
  MdPersonPin,
} from "react-icons/md";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { io } from "socket.io-client"; // Commented out for now
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { getTripLogsByVehicle } from "../../Store/Slices/Transportation/TripExecutionLog/tripExecutionLog.action";
import Pagination from "../Common/pagination";
import { useTranslation } from "react-i18next";
import MapView from "./MapView";
import TripStatusBadge from "./TripStatusBadge";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(advancedFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Status configuration
const TRIP_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const statusColor = {
  [TRIP_STATUS.NOT_STARTED]: "default",
  [TRIP_STATUS.IN_PROGRESS]: "processing",
  [TRIP_STATUS.COMPLETED]: "success",
  [TRIP_STATUS.CANCELLED]: "error",
};

const statusText = {
  [TRIP_STATUS.NOT_STARTED]: "Scheduled",
  [TRIP_STATUS.IN_PROGRESS]: "In Progress",
  [TRIP_STATUS.COMPLETED]: "Completed",
  [TRIP_STATUS.CANCELLED]: "Cancelled",
};

const TripDetailsSidebar = ({ trip, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const { t } = useTranslation();

  // Handle real-time updates (commented out for now)
  /*
  useEffect(() => {
    if (!trip?._id || !socket) return;
    const tripId = trip._id;
    socket.emit("admin_join_trip", tripId);
    const handleTripUpdate = (data) => {
      if (data.tripId === tripId) {
        setRealTimeData(data);
      }
    };
    socket.on("trip_update", handleTripUpdate);
    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setError(err.message || "Connection error");
    });
    return () => {
      socket.off("trip_update", handleTripUpdate);
      socket.off("error");
    };
  }, [trip?._id, socket]);
  */

  const formatTime = (date) => (date ? dayjs(date).format("h:mm A") : "--:--");

  if (!trip) return null;

  return (
    <Drawer
      width="90%"
      onClose={onClose}
      open={!!trip}
      title={
        <div className="flex items-center">
          <span className="text-lg font-semibold">
            Trip Details: {trip.routeId?.routeName || "Trip"}
          </span>
          <TripStatusBadge status={trip.status} className="ml-2" />
        </div>
      }
      destroyOnClose
      extra={
        <Button
          icon={<FaSync />}
          onClick={() => window.location.reload()}
          size="small"
          className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white"
        >
          Refresh
        </Button>
      }
      className="trip-details-drawer"
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      ) : (
        <div className="space-y-6">
          {/* Trip Summary Card */}
          <Card
            title={
              <span className="font-semibold text-[#7F35CD]">Trip Summary</span>
            }
            bordered={false}
            className="shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Vehicle",
                  value: trip.vehicleId?.vehicleNumber || "N/A",
                },
                { label: "Driver", value: trip.driverId?.name || "N/A" },
                {
                  label: "Trip Type",
                  value:
                    trip.tripType?.charAt(0).toUpperCase() +
                      trip.tripType?.slice(1) || "N/A",
                },
                {
                  label: "Shift",
                  value: trip.shiftId
                    ? `${trip.shiftId.shiftName} (${trip.shiftId.fromTime}-${trip.shiftId.toTime})`
                    : "N/A",
                },
                {
                  label: "Date",
                  value: dayjs(trip.tripDate).format("MMMM D, YYYY"),
                },
                {
                  label: "Status",
                  value: (
                    <Tag color={statusColor[trip.status]}>
                      {statusText[trip.status]}
                    </Tag>
                  ),
                },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-base mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Stops Timeline */}
          <Card
            title={
              <span className="font-semibold text-[#7F35CD]">
                Stops Timeline
              </span>
            }
            bordered={false}
            className="shadow-sm"
          >
            <div className="space-y-4">
              {trip.stopLogs?.map((stop, index) => {
                const stopStatus = stop.status || "pending";
                const statusConfig = {
                  completed: {
                    border: "border-green-500",
                    iconColor: "text-green-500",
                    icon: <MdLocationOn size={20} />,
                  },
                  arrived: {
                    border: "border-blue-500",
                    iconColor: "text-blue-500",
                    icon: <MdPersonPin size={20} />,
                  },
                  departed: {
                    border: "border-yellow-500",
                    iconColor: "text-yellow-500",
                    icon: <MdDirectionsBus size={20} />,
                  },
                  default: {
                    border: "border-gray-300",
                    iconColor: "text-gray-400",
                    icon: <MdLocationOn size={20} />,
                  },
                };

                const { border, iconColor, icon } =
                  statusConfig[stopStatus] || statusConfig.default;

                return (
                  <div
                    key={index}
                    className={`border-l-4 pl-4 py-3 ${border} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start">
                      <div className={`mr-3 mt-1 ${iconColor}`}>{icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">
                              {stop.stopId?.stopName || `Stop ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              Order: {stop.order || index + 1}
                            </p>
                          </div>
                          <Tag
                            color={
                              stopStatus === "completed"
                                ? "success"
                                : stopStatus === "arrived"
                                ? "processing"
                                : stopStatus === "departed"
                                ? "warning"
                                : "default"
                            }
                          >
                            {stopStatus}
                          </Tag>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">
                              Scheduled Arrival
                            </p>
                            <p>{formatTime(stop.scheduledArrival)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Scheduled Departure
                            </p>
                            <p>{formatTime(stop.scheduledDeparture)}</p>
                          </div>
                          {stop.actualArrival && (
                            <div>
                              <p className="text-xs text-gray-500">
                                Actual Arrival
                              </p>
                              <p>{formatTime(stop.actualArrival)}</p>
                            </div>
                          )}
                          {stop.actualDeparture && (
                            <div>
                              <p className="text-xs text-gray-500">
                                Actual Departure
                              </p>
                              <p>{formatTime(stop.actualDeparture)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Location Map */}
          <Card
            title={
              <span className="font-semibold text-[#7F35CD]">Location Map</span>
            }
            bordered={false}
            className="shadow-sm"
            extra={
              trip.currentLocation && (
                <span className="text-sm text-gray-500">
                  Last updated: {dayjs().format("h:mm:ss A")}
                </span>
              )
            }
          >
            {trip.currentLocation ? (
              <div className="relative h-96 rounded-lg overflow-hidden border">
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <Spin
                      tip="Loading map..."
                      indicator={<LoadingOutlined spin />}
                    />
                  </div>
                )}
                <MapView
                  currentLocation={trip.currentLocation}
                  stops={trip.stopLogs}
                  onLoad={() => setMapLoading(false)}
                  onError={() => {
                    setMapLoading(false);
                    setError("Failed to load map");
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <FaExclamationTriangle size={32} className="mb-2" />
                <p>No location data available</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </Drawer>
  );
};

const ViewTripsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { vehicleId } = useParams();

  // State management
  const [activeTab, setActiveTab] = useState("today");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tripTypeFilter, setTripTypeFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  // const [socket, setSocket] = useState(null); // Commented out for now
  // const [socketConnected, setSocketConnected] = useState(false); // Commented out for now

  // Redux state with safe defaults
  const {
    loading = false,
    vehicleWiseLogs = [],
    pagination = { currentPage: 1, limit: 10, totalItems: 0, totalPages: 1 },
    error: reduxError,
  } = useSelector((s) => s.transportation?.tripExecutionLog || {});

  // Initialize socket connection (commented out for now)
  /*
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      transports: ["websocket"],
      path: "/socket.io",
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      message.error("Realtime connection failed - updates may be delayed");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  */

  // Fetch trips when params change with error handling
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        await dispatch(
          getTripLogsByVehicle({
            vehicleId,
            page: pagination?.currentPage || 1,
            limit: pagination?.limit || 10,
            type: activeTab,
          })
        );
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        message.error("Failed to load trip data. Please try again later.");
      }
    };

    fetchTrips();
  }, [vehicleId, activeTab, dispatch]);

  // Filter trips based on search/filters with null checks
  const filteredTrips = useMemo(() => {
    let trips = Array.isArray(vehicleWiseLogs) ? vehicleWiseLogs : [];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      trips = trips.filter((t) => {
        const routeName = t.routeId?.routeName?.toLowerCase() || "";
        const vehicleNumber = t.vehicleId?.vehicleNumber?.toLowerCase() || "";
        const driverName = t.driverId?.name?.toLowerCase() || "";
        return (
          routeName.includes(searchLower) ||
          vehicleNumber.includes(searchLower) ||
          driverName.includes(searchLower)
        );
      });
    }

    if (dateRange?.length === 2) {
      trips = trips.filter((t) => {
        const tripDate = t.tripDate ? dayjs(t.tripDate) : null;
        return (
          tripDate &&
          tripDate.isBetween(
            dateRange[0]?.startOf("day") || dayjs(),
            dateRange[1]?.endOf("day") || dayjs(),
            "day",
            "[]"
          )
        );
      });
    }

    if (statusFilter !== "all") {
      trips = trips.filter((t) => t.status === statusFilter);
    }

    if (tripTypeFilter !== "all") {
      trips = trips.filter((t) => t.tripType === tripTypeFilter);
    }

    return trips;
  }, [vehicleWiseLogs, searchText, dateRange, statusFilter, tripTypeFilter]);

  // Handle pagination changes with error handling
  const handlePageChange = useCallback(
    (page) => {
      try {
        dispatch(
          getTripLogsByVehicle({
            vehicleId,
            page,
            limit: pagination.limit,
            type: activeTab,
          })
        );
      } catch (err) {
        console.error("Failed to change page:", err);
        message.error("Failed to load page. Please try again.");
      }
    },
    [vehicleId, activeTab, pagination.limit, dispatch]
  );

  const handleLimitChange = useCallback(
    (limit) => {
      try {
        dispatch(
          getTripLogsByVehicle({
            vehicleId,
            page: 1,
            limit,
            type: activeTab,
          })
        );
      } catch (err) {
        console.error("Failed to change limit:", err);
        message.error("Failed to change items per page. Please try again.");
      }
    },
    [vehicleId, activeTab, dispatch]
  );

  // Format duration between two dates with null checks
  const formatDuration = (start, end) => {
    if (!start || !end) return "--:--";
    try {
      const dur = dayjs.duration(dayjs(end).diff(dayjs(start)));
      const hours = Math.floor(dur.asHours());
      const minutes = dur.minutes();
      return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
    } catch {
      return "--:--";
    }
  };

  // Table columns configuration with null checks
  const columns = [
    {
      title: "Trip Info",
      key: "tripInfo",
      render: (_, record) => {
        const tripType = record.tripType || "unknown";
        const routeName = record.routeId?.routeName || "Unnamed Route";
        const tripDate = record.tripDate
          ? dayjs(record.tripDate).format("MMM D, YYYY")
          : "N/A";
        const shiftInfo = record.shiftId
          ? `${record.shiftId.shiftName} (${record.shiftId.fromTime}-${record.shiftId.toTime})`
          : "No shift info";

        return (
          <div className="flex items-start">
            <Badge
              count={tripType === "pickup" ? "P" : "D"}
              style={{
                backgroundColor: tripType === "pickup" ? "#C83B62" : "#7F35CD",
              }}
              className="mr-3 mt-1"
            />
            <div>
              <div className="font-medium">{routeName}</div>
              <div className="text-xs text-gray-500">{tripDate}</div>
              <div className="text-xs text-blue-600">{shiftInfo}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Driver/Vehicle",
      key: "driverVehicle",
      render: (_, record) => (
        <div>
          <div className="flex items-center">
            <MdPersonPin className="mr-1 text-[#7F35CD]" />
            <span>{record.driverId?.name || "N/A"}</span>
          </div>
          <div className="flex items-center mt-1">
            <MdDirectionsBus className="mr-1 text-[#C83B62]" />
            <span>{record.vehicleId?.vehicleNumber || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Timing",
      key: "timing",
      render: (_, record) => {
        const createdAt = record.createdAt
          ? dayjs(record.createdAt).format("h:mm A")
          : "N/A";
        const startedAt = record.startedAt
          ? dayjs(record.startedAt).format("h:mm A")
          : null;
        const endedAt = record.endedAt
          ? dayjs(record.endedAt).format("h:mm A")
          : null;

        return (
          <div className="space-y-1">
            <div className="flex items-center">
              <FaClock className="mr-1 text-gray-500" />
              <span>Scheduled: {createdAt}</span>
            </div>
            {startedAt && (
              <div className="flex items-center">
                <FaPlay className="mr-1 text-green-500" size={12} />
                <span>Started: {startedAt}</span>
              </div>
            )}
            {endedAt && (
              <div className="flex items-center">
                <FaStop className="mr-1 text-red-500" size={12} />
                <span>Ended: {endedAt}</span>
              </div>
            )}
            {startedAt && endedAt && (
              <div className="flex items-center">
                <MdTimelapse className="mr-1 text-blue-500" />
                <span>
                  Duration: {formatDuration(record.startedAt, record.endedAt)}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Stops",
      key: "stops",
      render: (_, record) => {
        const stops = record.stopLogs || [];
        const completedStops = stops.filter(
          (s) => s.status === "completed"
        ).length;

        return (
          <Popover
            content={
              <div className="max-h-60 overflow-y-auto pr-1">
                {stops.map((stop, index) => {
                  const stopStatus = stop.status || "pending";
                  const statusConfig = {
                    completed: {
                      color: "text-green-500",
                      icon: <MdLocationOn size={16} />,
                    },
                    arrived: {
                      color: "text-blue-500",
                      icon: <MdPersonPin size={16} />,
                    },
                    departed: {
                      color: "text-yellow-500",
                      icon: <MdDirectionsBus size={16} />,
                    },
                    default: {
                      color: "text-gray-400",
                      icon: <MdLocationOn size={16} />,
                    },
                  };

                  const { color, icon } =
                    statusConfig[stopStatus] || statusConfig.default;

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-2 mb-2"
                    >
                      <div className={`mt-1 ${color}`}>{icon}</div>
                      <div>
                        <div className="font-medium text-sm">
                          {stop.stopId?.stopName || `Stop ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stop.scheduledArrival
                            ? dayjs(stop.scheduledArrival).format("h:mm A")
                            : "--:--"}{" "}
                          -{" "}
                          {stop.scheduledDeparture
                            ? dayjs(stop.scheduledDeparture).format("h:mm A")
                            : "--:--"}
                        </div>
                        {stop.actualArrival && (
                          <div className="text-xs text-green-600">
                            Arrived:{" "}
                            {dayjs(stop.actualArrival).format("h:mm A")}
                          </div>
                        )}
                        {stop.actualDeparture && (
                          <div className="text-xs text-blue-600">
                            Departed:{" "}
                            {dayjs(stop.actualDeparture).format("h:mm A")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            trigger="hover"
          >
            <div className="flex items-center cursor-pointer hover:text-[#7F35CD] transition-colors">
              <MdLocationOn className="mr-1 text-[#C83B62]" />
              <span className="text-sm font-medium">
                {completedStops}/{stops.length} stops
              </span>
            </div>
          </Popover>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <TripStatusBadge
          status={record.status}
          lastUpdated={record.lastUpdated}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View details">
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => setSelectedTrip(record)}
              size="small"
              className="hover:bg-[#7F35CD] hover:text-white transition-colors"
            />
          </Tooltip>
          <Tooltip title="View on map">
            <Button
              icon={<FaMapMarkedAlt />}
              onClick={() => {
                setSelectedTrip(record);
                setMapModalVisible(true);
              }}
              size="small"
              className="hover:bg-[#C83B62] hover:text-white transition-colors"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header with title and filters */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#7F35CD] mb-4">
          Trip Management
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search trips..."
            prefix={<FaSearch className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="rounded-lg"
          />
          <RangePicker
            className="w-full rounded-lg"
            onChange={(dates) => setDateRange(dates)}
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
          <Select
            className="w-full rounded-lg"
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            allowClear
          >
            <Option value="all">All Statuses</Option>
            {Object.values(TRIP_STATUS).map((status) => (
              <Option key={status} value={status}>
                {statusText[status]}
              </Option>
            ))}
          </Select>
          <Select
            className="w-full rounded-lg"
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
      </div>

      {/* Error display */}
      {reduxError && (
        <Alert
          message="Error"
          description={reduxError}
          type="error"
          showIcon
          closable
          className="mb-4"
        />
      )}

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <TabPane
          key="today"
          tab={
            <span className="flex items-center">
              <FaCalendarAlt className="mr-2 text-[#7F35CD]" />
              <span className="font-medium">Today's Trips</span>
            </span>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredTrips.filter((t) =>
              t.tripDate ? dayjs(t.tripDate).isSame(dayjs(), "day") : false
            )}
            rowKey="_id"
            pagination={false}
            loading={loading}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <p className="text-gray-600">
                        No trips scheduled for today
                      </p>
                      <Button
                        type="primary"
                        className="mt-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
                        onClick={() => window.location.reload()}
                      >
                        Refresh
                      </Button>
                    </div>
                  }
                />
              ),
            }}
            className="rounded-lg overflow-hidden"
          />
        </TabPane>
        <TabPane
          key="history"
          tab={
            <span className="flex items-center">
              <FaHistory className="mr-2 text-[#7F35CD]" />
              <span className="font-medium">Trip History</span>
            </span>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredTrips.filter((t) =>
              t.tripDate ? !dayjs(t.tripDate).isSame(dayjs(), "day") : false
            )}
            rowKey="_id"
            pagination={false}
            loading={loading}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <p className="text-gray-600">No historical trips found</p>
                      <Button
                        type="primary"
                        className="mt-2 bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
                        onClick={() => window.location.reload()}
                      >
                        Refresh
                      </Button>
                    </div>
                  }
                />
              ),
            }}
            className="rounded-lg overflow-hidden"
          />
        </TabPane>
      </Tabs>

      {/* Pagination */}
      {filteredTrips.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
          <Pagination
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalItems}
            limit={pagination.limit}
            setPage={handlePageChange}
            setLimit={handleLimitChange}
            t={t}
          />
        </div>
      )}

      {/* Trip Details Drawer */}
      <TripDetailsSidebar
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      {/* Map Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <FaMapMarkedAlt className="mr-2 text-[#7F35CD]" />
            <span className="font-semibold">
              {selectedTrip?.routeId?.routeName || "Trip"} Route Map
            </span>
          </div>
        }
        open={mapModalVisible}
        onCancel={() => setMapModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
        className="map-modal"
      >
        {selectedTrip && (
          <div style={{ height: "70vh" }}>
            <MapView
              trip={selectedTrip}
              stops={selectedTrip.stopLogs}
              currentLocation={selectedTrip.currentLocation}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewTripsList;
