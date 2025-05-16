// import React from "react";
// import {
//   FaClock,
//   FaPlay,
//   FaStop,
//   FaRoute,
//   FaBus,
//   FaUserAlt,
//   FaUsers,
//   FaMapMarkedAlt,
//   FaChartLine,
//   FaHistory,
//   FaCalendarAlt,
//   FaFilter,
//   FaSearch,
//   FaInfoCircle,
//   FaCrosshairs,
// } from "react-icons/fa";
// import {
//   MdLocationOn,
//   MdTimelapse,
//   MdDirectionsBus,
//   MdDirections,
//   MdSpeed,
//   MdGpsFixed,
// } from "react-icons/md";
// import {
//   Tag,
//   Space,
//   Button,
//   Badge,
//   Popover,
//   Timeline,
//   Divider,
//   Input,
//   DatePicker,
//   Select,
//   Progress,
//   message,
//   Tooltip,
//   Switch,
// } from "antd";
// import {
//   PlayCircleOutlined,
//   StopOutlined,
//   InfoCircleOutlined,
//   CloseOutlined,
//   CheckOutlined,
//   ExclamationOutlined,
//   AimOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";

// const statusColor = {
//   completed: "green",
//   in_progress: "gold",
//   pending: "orange",
//   skipped: "red",
//   cancelled: "gray",
// };

// const statusText = {
//   completed: "Completed",
//   in_progress: "In Progress",
//   pending: "Pending",
//   skipped: "Skipped",
//   cancelled: "Cancelled",
// };

// const stopStatusColor = {
//   start_point: "green",
//   pending: "orange",
//   skipped: "red",
//   completed: "blue",
//   in_progress: "gold",
// };

// const stopStatusText = {
//   start_point: "Start Point",
//   pending: "Pending",
//   skipped: "Skipped",
//   completed: "Completed",
//   in_progress: "In Progress",
// };

// const formatTime = (dateString) => {
//   if (!dateString) return "N/A";
//   return dayjs(dateString).format("h:mm A");
// };

// const formatDuration = (start, end) => {
//   if (!start || !end) return "N/A";
//   const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
//   return `${duration.minutes()}m ${duration.seconds()}s`;
// };

// const TripColumns = ({
//   handleViewDetails,
//   handleViewMap,
//   currentLocation,
//   isGpsOn,
//   dispatch,
//   setConfirmLoading,
// }) => {
//   const handleStart = (trip) => {
//     Modal.confirm({
//       title: "Confirm Start Trip",
//       icon: <ExclamationOutlined />,
//       content: `Are you sure you want to start the ${trip.tripType} trip for ${trip.routeId?.routeName}?`,
//       okText: "Start Trip",
//       okButtonProps: { type: "primary" },
//       cancelText: "Cancel",
//       onOk() {
//         setConfirmLoading(true);
//         setTimeout(() => {
//           message.success(`Trip ${trip._id} started successfully`);
//           setConfirmLoading(false);
//           const payload = {
//             DEFAULT_SPEED_KMPH: 40,
//             HALT_TIME_MINUTES: 2,
//             currentLocation: {
//               lat: currentLocation?.lat,
//               lng: currentLocation?.lng,
//             },
//           };
//           dispatch(
//             startTripLog({
//               tripId: trip._id,
//               isGPSOn: isGpsOn,
//               payload,
//               vehicleId,
//             })
//           );
//         }, 1500);
//       },
//     });
//   };

//   const handleStop = (trip) => {
//     Modal.confirm({
//       title: "Confirm End Trip",
//       icon: <ExclamationOutlined />,
//       content: `Are you sure you want to end the ${trip.tripType} trip for ${trip.routeId?.routeName}?`,
//       okText: "End Trip",
//       okButtonProps: { danger: true },
//       cancelText: "Cancel",
//       onOk() {
//         setConfirmLoading(true);
//         setTimeout(() => {
//           message.success(`Trip ${trip._id} ended successfully`);
//           setConfirmLoading(false);
//           dispatch(
//             endTripLog({ tripId: trip._id, vehicleId, currentLocation: null })
//           );
//         }, 1500);
//       },
//     });
//   };

//   return [
//     {
//       title: "Trip Info",
//       dataIndex: "tripInfo",
//       key: "tripInfo",
//       render: (_, record) => (
//         <div className="flex items-center">
//           <div className="mr-3">
//             <Badge
//               count={record.tripType === "pickup" ? "P" : "D"}
//               style={{
//                 backgroundColor:
//                   record.tripType === "pickup" ? "#1890ff" : "#52c41a",
//               }}
//               title={record.tripType === "pickup" ? "Pickup" : "Drop"}
//             />
//           </div>
//           <div>
//             <div className="font-medium">
//               {record.tripType === "pickup" ? "Pick Up" : "Drop Off"}
//             </div>
//             <div className="text-xs text-gray-500">
//               {dayjs(record.tripDate).format("MMM D, YYYY")}
//             </div>
//             {record.shiftId && (
//               <div className="text-xs text-blue-600">
//                 {record.shiftId.shiftName} <br />({record.shiftId.fromTime} -{" "}
//                 {record.shiftId.toTime})
//               </div>
//             )}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Timing",
//       dataIndex: "timing",
//       key: "timing",
//       render: (_, record) => (
//         <div className="flex flex-col">
//           <div className="flex items-center">
//             <FaClock className="mr-1 text-gray-500" />
//             <span>Scheduled: {formatTime(record.createdAt)}</span>
//           </div>
//           {record.startedAt && (
//             <div className="flex items-center mt-1">
//               <FaPlay className="mr-1 text-green-500" size={12} />
//               <span>Started: {formatTime(record.startedAt)}</span>
//             </div>
//           )}
//           {record.endedAt && (
//             <div className="flex items-center mt-1">
//               <FaStop className="mr-1 text-red-500" size={12} />
//               <span>Ended: {formatTime(record.endedAt)}</span>
//             </div>
//           )}
//           {record.startedAt && record.endedAt && (
//             <div className="flex items-center mt-1">
//               <MdTimelapse className="mr-1 text-blue-500" />
//               <span>
//                 Duration: {formatDuration(record.startedAt, record.endedAt)}
//               </span>
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Stops",
//       dataIndex: "stops",
//       key: "stops",
//       render: (_, record) => (
//         <Popover
//           content={
//             <div className="p-3 w-64">
//               <div className="font-semibold text-base mb-3 border-b pb-1">
//                 Route Stops
//               </div>
//               <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
//                 {record?.stopLogs?.map((stop, i) => (
//                   <div key={i} className="flex items-start space-x-2">
//                     <MdLocationOn
//                       className={`mt-1 text-lg ${
//                         stop.status === "start_point"
//                           ? "text-green-500"
//                           : stop.status === "completed"
//                           ? "text-blue-500"
//                           : stop.status === "in_progress"
//                           ? "text-yellow-500"
//                           : "text-gray-400"
//                       }`}
//                     />
//                     <div className="flex-1">
//                       <div className="font-medium text-sm">
//                         {stop.stopId?.stopName || "Unknown Stop"}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {formatTime(stop.scheduledArrival)} -{" "}
//                         {formatTime(stop.scheduledDeparture)}
//                       </div>
//                       <div className="text-xs italic text-gray-400 capitalize">
//                         Status: {stop.status?.replaceAll("_", " ")}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           }
//           trigger="hover"
//           placement="right"
//         >
//           <div className="flex items-center cursor-pointer hover:text-blue-600">
//             <MdLocationOn className="mr-1 text-red-500" />
//             <span className="text-sm font-medium">
//               {record.stopLogs.filter((s) => s.status !== "skipped").length}/
//               {record.stopLogs.length} stops
//             </span>
//           </div>
//         </Popover>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={statusColor[status] || "default"} className="capitalize">
//           {statusText[status] || status}
//         </Tag>
//       ),
//     },
//     {
//       title: "Connection",
//       key: "connection",
//       render: (_, record) => (
//         <Tooltip
//           title={socketConnected ? "Socket connected" : "Socket disconnected"}
//         >
//           <Badge
//             status={socketConnected ? "success" : "error"}
//             text={socketConnected ? "Live" : "Offline"}
//           />
//         </Tooltip>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space size="middle">
//           {record.status === "in_progress" ? (
//             <Button
//               type="primary"
//               danger
//               icon={<StopOutlined />}
//               onClick={() => handleStop(record)}
//               className="flex items-center"
//               size="small"
//               style={{ width: "100px" }}
//             >
//               End
//             </Button>
//           ) : record.status === "not_started" ? (
//             <Button
//               type="primary"
//               icon={<PlayCircleOutlined />}
//               onClick={() => handleStart(record)}
//               className="flex items-center"
//               size="small"
//               style={{
//                 backgroundColor: "green",
//                 borderColor: "green",
//                 width: "100px",
//               }}
//             >
//               Start
//             </Button>
//           ) : record.status === "completed" ? (
//             <Button
//               type="dashed"
//               icon={<StopOutlined />}
//               className="flex items-center"
//               size="small"
//               disabled
//               style={{ width: "100px" }}
//             >
//               Ended
//             </Button>
//           ) : null}

//           <Button
//             icon={<InfoCircleOutlined />}
//             onClick={() => handleViewDetails(record)}
//             className="flex items-center"
//             size="small"
//             style={{ width: "100px" }}
//           >
//             Details
//           </Button>

//           <Button
//             icon={<FaMapMarkedAlt />}
//             onClick={() => handleViewMap(record)}
//             className="flex items-center"
//             size="small"
//             style={{ width: "100px" }}
//           >
//             Map
//           </Button>
//         </Space>
//       ),
//     },
//   ];
// };

// export default TripColumns;

import React from "react";
import { FaMapMarkedAlt, FaPlay, FaStop } from "react-icons/fa";
import {
  PlayCircleOutlined,
  StopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Table, Tag, Space, Button, Badge, Tooltip } from "antd";
import dayjs from "dayjs";

/* ───────────────────────────── helper maps */
const statusColor = {
  completed: "green",
  in_progress: "gold",
  not_started: "default",
  cancelled: "red",
};
const statusText = {
  completed: "Completed",
  in_progress: "In Progress",
  not_started: "Not Started",
  cancelled: "Cancelled",
};

/* ───────────────────────────── columns factory */
const TripColumns = ({
  handleViewDetails,
  handleViewMap,
  handleStartTrip,
  handleStopTrip,
  socketConnected,
}) => [
  /* Trip date / type */
  {
    title: "Trip Date",
    dataIndex: "tripDate",
    key: "tripDate",
    render: (d) => dayjs(d).format("DD MMM YYYY"),
  },

  /* Status */
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

  /* Socket status */
  {
    title: "Connection",
    key: "connection",
    render: () => (
      <Tooltip
        title={socketConnected ? "Socket connected" : "Socket disconnected"}
      >
        <Badge
          status={socketConnected ? "success" : "error"}
          text={socketConnected ? "Live" : "Offline"}
        />
      </Tooltip>
    ),
  },

  /* Actions */
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space size="middle">
        {record.status === "in_progress" ? (
          <Button
            danger
            type="primary"
            icon={<StopOutlined />}
            size="small"
            onClick={() => handleStopTrip(record)}
          >
            End
          </Button>
        ) : record.status === "not_started" ? (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            style={{ background: "green", borderColor: "green" }}
            onClick={() => handleStartTrip(record)}
          >
            Start
          </Button>
        ) : (
          <Button disabled size="small" icon={<StopOutlined />}>
            Ended
          </Button>
        )}

        <Button
          size="small"
          icon={<InfoCircleOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Details
        </Button>

        <Button
          size="small"
          icon={<FaMapMarkedAlt />}
          onClick={() => handleViewMap(record)}
        >
          Map
        </Button>
      </Space>
    ),
  },
];

export default TripColumns;
