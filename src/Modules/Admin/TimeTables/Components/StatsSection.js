import React from "react";
import { Card, Tag } from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const TIMETABLE_TYPES = [
  {
    type: "weekly",
    label: "Weekly",
    icon: <CalendarOutlined />,
    color: "#FF99CC",
    bgColor: "rgba(255,153,204,0.2)",
  },
  {
    type: "exam",
    label: "Exams",
    icon: <BookOutlined />,
    color: "#29ABE2",
    bgColor: "rgba(41,171,226,0.2)",
  },
  {
    type: "event",
    label: "Events",
    icon: <CalendarOutlined />,
    color: "#77DD77",
    bgColor: "rgba(119,221,119,0.2)",
  },
  {
    type: "others",
    label: "Others",
    icon: <TeamOutlined />,
    color: "#FFD700",
    bgColor: "rgba(255,215,0,0.2)",
  },
];

export default function StatsSection({
  filteredTimetables,
  onTypeClick,
  activeType,
}) {
  return (
    <div className="mb-4">
      <div className="space-y-2">
        {TIMETABLE_TYPES.map((stat) => {
          const count = filteredTimetables.filter(
            (t) => t.type === stat.type
          ).length;
          const isActive = activeType === stat.type;

          return (
            <Card
              key={stat.type}
              className={`cursor-pointer transition-all ${
                isActive ? "ring-2 ring-offset-4" : ""
              }`}
              style={{
                borderLeft: `4px solid ${stat.color}`,
                transform: isActive ? "scale(1.02)" : "scale(1)",
                height: "60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              onClick={() => onTypeClick(stat.type)}
              bodyStyle={{ padding: "8px" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded mr-2"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    {React.cloneElement(stat.icon, { className: "text-sm" })}
                  </div>
                  <span className="text-xs">{stat.label}</span>
                </div>
                <span
                  className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full"
                  style={{ backgroundColor: stat.color }}
                >
                  {count}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
