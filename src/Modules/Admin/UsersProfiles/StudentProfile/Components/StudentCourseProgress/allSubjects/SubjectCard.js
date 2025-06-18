import React from "react";
import { FaBook } from "react-icons/fa";

const SubjectCard = ({ subject = {} }) => {
  const {
    subjectName = "No Subject",
    started = "N/A",
    totalModule = 0,
    completedModule = 0,
    percentageValue = 0,
    subjectIcon = null,
    subjectColor = "#ec4899", // fallback pink
  } = subject;

  /* Integer 0-100 padded to two digits */
  const pct = String(Math.round(+percentageValue || 0)).padStart(2, "0");

  return (
    <div
      className={`bg-white shadow-md rounded-lg flex flex-col gap-3 p-4 border
                  border-gray-200 border-l-4`}
      style={{ borderLeftColor: subjectColor }}
    >
      {/* ─── Header ───────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Avatar block with fixed size (50 px × 50 px) */}
        <div className="w-[50px] h-[50px] flex items-center justify-center">
          {subjectIcon ? (
            <img
              src={subjectIcon}
              alt=""
              className="w-full h-full object-contain"
            />
          ) : (
            <FaBook className="w-full h-full" style={{ color: subjectColor }} />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-medium">{subjectName}</span>
          <span className="text-xs text-gray-600">
            Started: {started !== "N/A" ? started.slice(0, 10) : "N/A"}
          </span>
        </div>
      </div>

      {/* ─── Progress bar ─────────────────────────────────── */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${percentageValue || 0}%`,
            backgroundColor: subjectColor,
          }}
        />
      </div>

      {/* ─── Footer ───────────────────────────────────────── */}
      <div className="flex justify-between items-center text-sm">
        <span>
          {completedModule}/{totalModule} Modules
        </span>
        <span className="font-semibold" style={{ color: subjectColor }}>
          {pct}%
        </span>
      </div>
    </div>
  );
};

export default SubjectCard;
