import React from "react";
import { Badge, Tooltip } from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const TripStatusBadge = ({ status, lastUpdated, className = "" }) => {
  const statusConfig = {
    not_started: {
      color: "default",
      text: "Scheduled",
      icon: <ClockCircleOutlined />,
      tooltip: "Trip has not started yet",
    },
    in_progress: {
      color: "processing",
      text: "In Progress",
      icon: <SyncOutlined spin />,
      tooltip: `Trip is currently ongoing${
        lastUpdated ? ` (updated ${dayjs(lastUpdated).fromNow()})` : ""
      }`,
    },
    completed: {
      color: "success",
      text: "Completed",
      icon: <CheckCircleOutlined />,
      tooltip: "Trip has been completed",
    },
    cancelled: {
      color: "error",
      text: "Cancelled",
      icon: <CloseCircleOutlined />,
      tooltip: "Trip was cancelled",
    },
    delayed: {
      color: "warning",
      text: "Delayed",
      icon: <ExclamationCircleOutlined />,
      tooltip: `Trip is delayed${
        lastUpdated ? ` (last update ${dayjs(lastUpdated).fromNow()})` : ""
      }`,
    },
    default: {
      color: "default",
      text: "Unknown",
      icon: <LoadingOutlined />,
      tooltip: "Unknown trip status",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.default;

  return (
    <Tooltip title={currentStatus.tooltip}>
      <Badge
        className={className}
        color={currentStatus.color}
        status={status === "in_progress" ? "processing" : undefined}
        text={
          <span className="flex items-center">
            {currentStatus.icon}
            <span className="ml-1">{currentStatus.text}</span>
          </span>
        }
      />
    </Tooltip>
  );
};

export default TripStatusBadge;
