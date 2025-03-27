import {
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";

/**
 * Constants for timetable types and their configurations
 */
export const TIMETABLE_TYPES = [
  {
    type: "weekly",
    label: "Weekly",
    color: "#FF99CC",
    bgColor: "rgba(255,153,204,0.2)",
    icon: <CalendarOutlined className="text-lg" />,
  },
  {
    type: "exam",
    label: "Exams",
    color: "#29ABE2",
    bgColor: "rgba(41,171,226,0.2)",
    icon: <BookOutlined className="text-lg" />,
  },
  {
    type: "event",
    label: "Events",
    color: "#77DD77",
    bgColor: "rgba(119,221,119,0.2)",
    icon: <CalendarOutlined className="text-lg" />,
  },
  {
    type: "others",
    label: "Others",
    color: "#FFD700",
    bgColor: "rgba(255,215,0,0.2)",
    icon: <TeamOutlined className="text-lg" />,
  },
];
