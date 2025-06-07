// src/Modules/Student/StudentClass/Subjects/Modules/Quizzes/Partials/TimerBadge.jsx
import React from "react";
import { Badge } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const pad = (n) => String(n).padStart(2, "0");

export default function TimerBadge({ timeLeft }) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  return (
    <Badge
      count={
        <span className="font-mono text-sm">
          {pad(mins)}:{pad(secs)}
        </span>
      }
      offset={[0, 0]}
      style={{ background: "transparent", color: "#000" }}
    >
      <ClockCircleOutlined style={{ fontSize: 20 }} />
    </Badge>
  );
}
