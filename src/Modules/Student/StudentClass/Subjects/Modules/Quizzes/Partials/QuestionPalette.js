// src/…/Partials/QuestionPalette.jsx
import React from "react";
import { Avatar, Tooltip } from "antd";

const paletteColor = (idx, current, answered) => {
  if (idx === current) return "purple";
  if (answered.includes(idx)) return "green";
  return "red";
};

export default function QuestionPalette({ total, current, answered, onJump }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <Tooltip key={i} title={`Question ${i + 1}`}>
          <Avatar
            size={40}
            style={{
              cursor: "pointer",
              background: paletteColor(i, current, answered),
            }}
            onClick={() => onJump(i)}
          >
            {i + 1}
          </Avatar>
        </Tooltip>
      ))}
    </div>
  );
}
