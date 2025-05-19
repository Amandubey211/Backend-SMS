import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { InfoCircleOutlined } from "@ant-design/icons";
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
const TripColumns = ({ handleViewDetails, handleViewMap, socketConnected }) => [
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
