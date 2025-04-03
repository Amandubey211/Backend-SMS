import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Badge, Tooltip } from "antd";
import { format, isWithinInterval, parseISO } from "date-fns";

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
      // Check if timetable is within validity period
      if (tt.validity?.startDate && tt.validity?.endDate) {
        const isValid = isWithinInterval(currentDate, {
          start: parseISO(tt.validity.startDate),
          end: parseISO(tt.validity.endDate),
        });
        if (!isValid) return [];
      }

      if (tt.type === "weekly") {
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

    return (
      <div className="space-y-1">
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
