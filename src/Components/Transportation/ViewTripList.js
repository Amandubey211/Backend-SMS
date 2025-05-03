import React, { useEffect, useState, useMemo } from "react";
import {
  FaClock,
  FaPlay,
  FaStop,
  FaRoute,
  FaBus,
  FaUserAlt,
  FaUsers,
  FaMapMarkedAlt,
  FaChartLine,
  FaHistory,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdTimelapse,
  MdDirectionsBus,
  MdDirections,
  MdSpeed,
  MdGpsFixed,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
  Card,
  Popover,
  Timeline,
  Divider,
  Empty,
  Input,
  DatePicker,
  Select,
  Progress,
  Modal,
  message,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircleOutlined,
  StopOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import advancedFormat from "dayjs/plugin/advancedFormat";
import MapView from "./MapView";
import Sidebar from "../Common/Sidebar";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(advancedFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;

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

const ViewTripsList = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tripTypeFilter, setTripTypeFilter] = useState("all");
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);
  const [selectedTripForDetails, setSelectedTripForDetails] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isGpsOn, setIsGpsOn] = useState(false);
  const { loading, error, vehicleWiseLogs } = useSelector(
    (s) => s.transportation.tripExecutionLog
  );

  const { vehicleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTripLogsByVehicle(vehicleId));
  }, [vehicleId, dispatch]);

  const filteredTrips = useMemo(() => {
    let trips = vehicleWiseLogs || [];

    // Apply search filter
    if (searchText) {
      trips = trips.filter(
        (trip) =>
          trip.routeId?.routeName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          trip.vehicleId?.vehicleNumber
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange && dateRange.length === 2) {
      trips = trips.filter((trip) =>
        dayjs(trip.tripDate).isBetween(dateRange[0], dateRange[1], "day", "[]")
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      trips = trips.filter((trip) => trip.status === statusFilter);
    }

    // Apply trip type filter
    if (tripTypeFilter !== "all") {
      trips = trips.filter((trip) => trip.tripType === tripTypeFilter);
    }

    return trips;
  }, [vehicleWiseLogs, searchText, dateRange, statusFilter, tripTypeFilter]);

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("h:mm A");
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
    return `${duration.minutes()}m ${duration.seconds()}s`;
  };

  const getStopLogsDetails = (stopLogs) => {
    return (
      <div className=" overflow-x-auto px-4 ">
        <Timeline mode="left" className="pt-2 ">
          {stopLogs?.map((log, index) => (
            <Timeline.Item
              key={index}
              color={stopStatusColor[log.status] || "gray"}
              label={
                <div className="timeline-label">
                  <div className="font-medium">{log.stopId?.stopName}</div>
                  <div className="text-xs text-gray-500">
                    {formatTime(log.scheduledArrival)} -{" "}
                    {formatTime(log.scheduledDeparture)}
                  </div>
                </div>
              }
            >
              <div className="timeline-content">
                <div className="flex justify-between">
                  <div>
                    <Tag color={stopStatusColor[log.status]}>
                      {stopStatusText[log.status]}
                    </Tag>
                  </div>
                  <div className="text-xs">
                    <span
                      className={
                        log.actualArrival ? "text-gray-500" : "text-red-500"
                      }
                    >
                      {log.actualArrival ? (
                        <>
                          Arrived: {formatTime(log.actualArrival)}
                          {log.actualDeparture && (
                            <> | Departed: {formatTime(log.actualDeparture)}</>
                          )}
                        </>
                      ) : (
                        "Not arrived yet"
                      )}
                    </span>
                  </div>
                </div>
                {log.stopId?.location && (
                  <div className="mt-1 text-xs">
                    <span className="text-gray-500">Location:</span>{" "}
                    {log.stopId.location.lat.toFixed(6)},{" "}
                    {log.stopId.location.lng.toFixed(6)}
                  </div>
                )}
                {log.notes && (
                  <div className="mt-1 text-xs">
                    <span className="text-gray-500">Notes:</span> {log.notes}
                  </div>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    );
  };

  const columns = [
    {
      title: "Trip Info",
      dataIndex: "tripInfo",
      key: "tripInfo",
      render: (_, record) => (
        <div className="flex items-center">
          <div className="mr-3">
            <Badge
              count={record.tripType === "pickup" ? "P" : "D"}
              style={{
                backgroundColor:
                  record.tripType === "pickup" ? "#1890ff" : "#52c41a",
              }}
              title={record.tripType === "pickup" ? "Pickup" : "Drop"}
            />
          </div>
          <div>
            <div className="font-medium">
              {record.tripType === "pickup"
                ? "Pick Up"
                : "Drop Off"}
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(record.tripDate).format("MMM D, YYYY")}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Timing",
      dataIndex: "timing",
      key: "timing",
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <FaClock className="mr-1 text-gray-500" />
            <span>
              Scheduled: {formatTime(record.stopLogs[0]?.scheduledArrival)}
            </span>
          </div>
          {record.startedAt && (
            <div className="flex items-center mt-1">
              <FaPlay className="mr-1 text-green-500" size={12} />
              <span>Started: {formatTime(record.startedAt)}</span>
            </div>
          )}
          {record.endedAt && (
            <div className="flex items-center mt-1">
              <FaStop className="mr-1 text-red-500" size={12} />
              <span>Ended: {formatTime(record.endedAt)}</span>
            </div>
          )}
          {record.startedAt && record.endedAt && (
            <div className="flex items-center mt-1">
              <MdTimelapse className="mr-1 text-blue-500" />
              <span>
                Duration: {formatDuration(record.startedAt, record.endedAt)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Stops",
      dataIndex: "stops",
      key: "stops",
      render: (_, record) => (
        <Popover
          content={
            <div className="p-2">
              <div className="font-medium mb-2">Route Stops</div>
              <div className="max-h-60 overflow-y-auto">
                {record?.stopLogs?.map((stop, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <div className="flex items-center">
                      <MdLocationOn
                        className={`mr-2 ${
                          stop.status === "start_point"
                            ? "text-green-500"
                            : stop.status === "completed"
                            ? "text-blue-500"
                            : stop.status === "in_progress"
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <div className="font-medium">
                          {stop.stopId?.stopName || "Unknown Stop"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(stop.scheduledArrival)} -{" "}
                          {formatTime(stop.scheduledDeparture)}
                        </div>
                      </div>
                    </div>
                    {i < record.stopLogs.length - 1 && (
                      <Divider
                        className="my-2"
                        dashed
                        style={{ margin: "4px 0 4px 24px" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          }
          trigger="hover"
          placement="right"
        >
          <div className="flex items-center cursor-pointer">
            <MdLocationOn className="mr-1 text-red-500" />
            <span>
              {record.stopLogs.filter((s) => s.status !== "skipped").length}/
              {record.stopLogs.length} stops
            </span>
          </div>
        </Popover>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColor[status] || "default"} className="capitalize">
          {statusText[status] || status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "in_progress" ? (
            <Button
              type="primary"
              danger
              icon={<StopOutlined />}
              onClick={() => handleStop(record)}
              className="flex items-center"
              size="small"
              style={{ width: "100px" }} // Set fixed width for all buttons
            >
              End
            </Button>
          ) : record.status === "not_started" ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStart(record)}
              className="flex items-center"
              size="small"
              style={{
                backgroundColor: "green",
                borderColor: "green",
                width: "100px",
              }} // Set fixed width
            >
              Start
            </Button>
          ) : record.status === "completed" ? (
            <Button
              type="dashed"
              icon={<StopOutlined />}
              className="flex items-center"
              size="small"
              disabled
              style={{ width: "100px" }} // Set fixed width
            >
              Ended
            </Button>
          ) : null}

          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetails(record)}
            className="flex items-center"
            size="small"
            style={{ width: "100px" }} // Set fixed width
          >
            Details
          </Button>

          <Button
            icon={<FaMapMarkedAlt />}
            onClick={() => handleViewMap(record)}
            className="flex items-center"
            size="small"
            style={{ width: "100px" }} // Set fixed width
          >
            Map
          </Button>
        </Space>
      ),
    },
  ];

  const handleStart = (trip) => {
    Modal.confirm({
      title: "Confirm Start Trip",
      icon: <ExclamationOutlined />,
      content: `Are you sure you want to start the ${trip.tripType} trip for ${trip.routeId?.routeName}?`,
      okText: "Start Trip",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk() {
        setConfirmLoading(true);
        // Simulate API call
        setTimeout(() => {
          message.success(`Trip ${trip._id} started successfully`);
          setConfirmLoading(false);
          // In a real app, you would dispatch an action here
          const payload = {
            DEFAULT_SPEED_KMPH: 40,
            HALT_TIME_MINUTES: 2,
          };
          dispatch(
            startTripLog({
              tripId: trip._id,
              isGPSOn: isGpsOn,
              payload,
              vehicleId,
            })
          );
        }, 1500);
      },
    });
  };

  const handleStop = (trip) => {
    Modal.confirm({
      title: "Confirm End Trip",
      icon: <ExclamationOutlined />,
      content: `Are you sure you want to end the ${trip.tripType} trip for ${trip.routeId?.routeName}?`,
      okText: "End Trip",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk() {
        setConfirmLoading(true);
        // Simulate API call
        setTimeout(() => {
          message.success(`Trip ${trip._id} ended successfully`);
          setConfirmLoading(false);
          // In a real app, you would dispatch an action here
          dispatch(endTripLog({ tripId: trip._id, vehicleId }));
        }, 1500);
      },
    });
  };

  const handleViewDetails = (trip) => {
    setSelectedTripForDetails(trip);
    setShowDetailsSidebar(true);
  };

  const handleViewMap = (trip) => {
    setSelectedTripForMap(trip);
    setShowMapModal(true);
  };

  const renderTripDetails = () => {
    if (!selectedTripForDetails) return null;

    const record = selectedTripForDetails;
    const completedStops = record.stopLogs.filter(
      (s) => s.status === "completed" || s.status === "start_point"
    ).length;
    const totalStops = record.stopLogs.length;
    const progressPercent = Math.round((completedStops / totalStops) * 100);

    return (
      <div className="p-6 h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="grid grid-cols-5 gap-6 h-full">
          {/* Left Column - Timeline (60% width) */}
          <div className="col-span-3 h-full">
            <Card
              title={
                <div className="flex items-center">
                  <MdTimelapse className="mr-2 text-indigo-600" />
                  <span className="font-semibold text-gray-800">
                    Trip Timeline
                  </span>
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
              {getStopLogsDetails(record.stopLogs)}
            </Card>
          </div>

          {/* Right Column - Trip Progress and Summary (40% width) */}
          <div className="col-span-2 space-y-6 h-full">
            {/* Trip Progress Card */}
            <Card
              title={
                <div className="flex items-center">
                  <FaChartLine className="mr-2 text-green-600" />
                  <span className="font-semibold text-gray-800">
                    Trip Progress
                  </span>
                </div>
              }
              size="small"
              className="shadow-lg border-0"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Completion
                    </span>
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
                        : record.status === "in_progress"
                        ? "active"
                        : "normal"
                    }
                    strokeColor={
                      progressPercent === 100
                        ? "#10b981"
                        : record.status === "in_progress"
                        ? "#3b82f6"
                        : "#8b5cf6"
                    }
                    trailColor="#e2e8f0"
                    className="mb-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      GPS Status
                    </div>
                    <Tag
                      color={record.isGPSOn ? "green" : "red"}
                      icon={
                        record.isGPSOn ? <CheckOutlined /> : <CloseOutlined />
                      }
                      className="w-full text-center font-medium shadow-sm"
                    >
                      {record.isGPSOn ? "Active" : "Inactive"}
                    </Tag>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Vehicle Status
                    </div>
                    <Tag
                      color={
                        record.vehicleStatus === "active" ? "green" : "orange"
                      }
                      className="w-full text-center font-medium shadow-sm"
                    >
                      {record.vehicleStatus === "active"
                        ? "Operational"
                        : "Maintenance"}
                    </Tag>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-medium text-gray-500">
                      Duration
                    </div>
                    <div className="text-sm font-semibold text-indigo-700">
                      {record.startedAt && record.endedAt
                        ? formatDuration(record.startedAt, record.endedAt)
                        : "N/A"}
                    </div>
                  </div>
                  {record.startedAt && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Started:</span>{" "}
                      {dayjs(record.startedAt).format("h:mm A")}
                      {record.endedAt && (
                        <>
                          , <span className="font-medium">Ended:</span>{" "}
                          {dayjs(record.endedAt).format("h:mm A")}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {record.notes && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Trip Notes
                    </div>
                    <div className="text-sm p-2 bg-white rounded border border-gray-200">
                      {record.notes}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Trip Summary Card */}
            <Card
              title={
                <div className="flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-600" />
                  <span className="font-semibold text-gray-800">
                    Trip Summary
                  </span>
                </div>
              }
              size="small"
              className="shadow-lg border-0"
            >
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Route Details
                  </div>
                  <div className="flex items-center">
                    <FaRoute className="mr-3 text-blue-500 text-lg" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {record.routeId?.routeName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.tripType === "pickup"
                          ? "Morning Pickup"
                          : "Afternoon Drop"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Vehicle Details
                  </div>
                  <div className="flex items-center">
                    <FaBus className="mr-3 text-green-500 text-lg" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {record.vehicleId?.vehicleNumber || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.vehicleId?.vehicleType || "N/A"} •{" "}
                        {record.vehicleId?.capacity || "N/A"} seats
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Speed
                    </div>
                    <div className="flex items-center">
                      <MdSpeed className="mr-2 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-800">
                        {record.DEFAULT_SPEED_KMPH || "N/A"} km/h
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Halt Time
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-orange-500" />
                      <span className="text-sm font-semibold text-gray-800">
                        {record.HALT_TIME_MINUTES || "N/A"} mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Passengers
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-3 text-teal-500 text-lg" />
                    <div className="flex space-x-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {record.stopLogs.reduce(
                            (sum, stop) => sum + (stop.students?.length || 0),
                            0
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Students</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {record.stopLogs.reduce(
                            (sum, stop) => sum + (stop.staffs?.length || 0),
                            0
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Staff</div>
                      </div>
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

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="">
          <div className="flex justify-between items-start">
            <div>
              {/* <h1 className="text-2xl font-bold text-gray-800">
                Trip Management
              </h1> */}
              {/* <p className="text-gray-600">
                View and manage all trips for vehicle {vehicleId}
              </p> */}
            </div>
          </div>

          {/* <Divider className="my-4" /> */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            {/* <Input
              placeholder="Search trips..."
              prefix={<FaSearch className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            /> */}

            {/* <RangePicker
              className="w-full"
              onChange={(dates) => setDateRange(dates)}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            /> */}

            {/* <Select
              placeholder="Filter by status"
              className="w-full"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              allowClear
              onClear={() => setStatusFilter("all")}
            >
              <Option value="all">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="skipped">Skipped</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>

            <Select
              placeholder="Filter by trip type"
              className="w-full"
              value={tripTypeFilter}
              onChange={(value) => setTripTypeFilter(value)}
              allowClear
              onClear={() => setTripTypeFilter("all")}
            >
              <Option value="all">All Types</Option>
              <Option value="pickup">Pickup</Option>
              <Option value="drop">Drop</Option>
            </Select> */}
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          animated={{ inkBar: true, tabPane: true }}
          className="custom-tabs"
        >
          <Tabs.TabPane
            tab={
              <span className="flex items-center">
                <FaCalendarAlt className="mr-1" /> Today's Trips
              </span>
            }
            key="today"
          >
            <AnimatePresence>
              <motion.div
                key="today-trips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Table
                  columns={columns}
                  dataSource={filteredTrips.filter((trip) =>
                    dayjs(trip.tripDate).isSame(dayjs(), "day")
                  )}
                  rowKey="_id"
                  // pagination={{ pageSize: 5 }}
                  loading={loading || confirmLoading}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span className="text-gray-500">
                            No trips scheduled for today
                          </span>
                        }
                      />
                    ),
                  }}
                  className="custom-table"
                />
              </motion.div>
            </AnimatePresence>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span className="flex items-center">
                <FaHistory className="mr-1" /> Trip History
              </span>
            }
            key="history"
          >
            <AnimatePresence>
              <motion.div
                key="history-trips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Table
                  columns={columns}
                  dataSource={filteredTrips.filter(
                    (trip) => !dayjs(trip.tripDate).isSame(dayjs(), "day")
                  )}
                  rowKey="_id"
                  // pagination={{ pageSize: 5 }}
                  loading={loading}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span className="text-gray-500">
                            No historical trips found
                          </span>
                        }
                      />
                    ),
                  }}
                  className="custom-table"
                />
              </motion.div>
            </AnimatePresence>
          </Tabs.TabPane>
        </Tabs>
      </motion.div>

      {/* Trip Details Sidebar */}
      <Sidebar
        isOpen={showDetailsSidebar}
        title={`Trip Details: ${
          selectedTripForDetails?.routeId?.routeName || "Trip"
        }`}
        onClose={() => setShowDetailsSidebar(false)}
        width="80%"
      >
        {renderTripDetails()}
      </Sidebar>

      {/* Map View Modal */}
      <Modal
        title={`Route Map: ${selectedTripForMap?.routeId?.routeName || "Trip"}`}
        visible={showMapModal}
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
    </div>
  );
};

export default ViewTripsList;
