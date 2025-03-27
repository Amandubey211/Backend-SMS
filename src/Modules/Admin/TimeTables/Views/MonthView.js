import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Badge, Tooltip } from "antd";
import { format } from "date-fns";

export default function MonthView({
  selectedDate,
  filteredTimetables,
  setSelectedDate,
  onEventClick,
}) {
  const dateCellRender = (currentDayjs) => {
    const currentDate = currentDayjs.toDate();
    const dateString = currentDayjs.format("YYYY-MM-DD");

    const matched = filteredTimetables.flatMap((tt) => {
      if (tt.type === "weekly") {
        if (!isWithinValidity(tt, currentDate)) return [];
        const dayName = currentDayjs.format("dddd");
        return tt.days?.find((d) => d.day === dayName) ? [tt] : [];
      } else {
        return tt.days?.find((d) => {
          if (!d.date) return false;
          const dStr = dayjs(d.date).format("YYYY-MM-DD");
          return dStr === dateString;
        })
          ? [tt]
          : [];
      }
    });

    if (matched.length === 0) return null;

    const density = Math.min(matched.length / 3, 1);
    const bgColor = `rgba(66, 153, 225, ${0.2 + density * 0.3})`;

    return (
      <div className="space-y-1">
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: bgColor }}
        />
        {matched.map((evt) => {
          const firstSlot = evt.days?.find(
            (d) =>
              d.day === currentDayjs.format("dddd") ||
              (d.date && dayjs(d.date).format("YYYY-MM-DD") === dateString)
          )?.slots?.[0];

          let displayText =
            firstSlot?.subjectId?.name || firstSlot?.eventName || evt.name;

          // Add class name if available
          if (evt.classId?.className) {
            displayText += ` (${evt.classId.className})`;
          }

          return (
            <Tooltip
              key={evt._id}
              title={`${displayText} (${evt.type})`}
              color={getColorByType(evt.type)}
              placement="bottom"
            >
              <div
                className="px-2 py-1 rounded text-white text-xs cursor-pointer truncate"
                style={{
                  backgroundColor: getColorByType(evt.type),
                  fontSize: "10px",
                  lineHeight: "1.2",
                  padding: "2px 4px",
                  marginBottom: "2px",
                }}
                onClick={() => onEventClick(evt)}
              >
                {displayText}
              </div>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      key="monthView"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <Calendar
        value={dayjs(selectedDate)}
        onSelect={(dayjsObj) => setSelectedDate(dayjsObj?.toDate())}
        dateCellRender={dateCellRender}
        className="bg-white shadow-sm border rounded-lg px-2"
      />
    </motion.div>
  );
}

function isWithinValidity(timetable, currentDate) {
  if (!timetable.validity) return true;
  const { startDate, endDate } = timetable.validity;
  if (!startDate || !endDate) return true;
  return currentDate >= new Date(startDate) && currentDate <= new Date(endDate);
}

function getColorByType(type) {
  switch (type) {
    case "weekly":
      return "#FF99CC";
    case "exam":
      return "#29ABE2";
    case "event":
      return "#77DD77";
    case "others":
      return "#FFD700";
    default:
      return "#D3D3D3";
  }
}
