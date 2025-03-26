import React from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Badge } from "antd";
import { TfiTime } from "react-icons/tfi";
import { Element } from "react-scroll";

export default function WeekView({
  selectedDate,
  filteredTimetables,
  onEventClick,
  onDateChange,
}) {
  const dayOfWeek = +format(selectedDate, "i");
  const monday = new Date(selectedDate);
  monday.setDate(monday.getDate() - (dayOfWeek - 1));

  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  // Time slots from 8AM to 8PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  // Function to calculate cell height based on duration
  const calculateCellHeight = (startTime, endTime) => {
    if (!startTime || !endTime) return 1;
    const duration =
      (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    return Math.max(1, Math.round(duration));
  };

  return (
    <motion.div
      key="weekView"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="p-4 overflow-x-auto"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold mb-4">
          Week of {format(daysInWeek[0], "dd MMM")} -{" "}
          {format(daysInWeek[6], "dd MMM")}
        </h3>
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="week-date" className="mr-2 font-medium">
            Select Date:
          </label>
          <input
            id="week-date"
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="border rounded p-1"
          />
        </div>
      </div>

      <div className="flex min-w-max bg-white rounded-lg shadow">
        {/* Time column */}
        <div className="w-16 mt-6 flex-shrink-0">
          <div className="h-10 border-b border-gray-200 flex justify-center text-2xl">
            <TfiTime />
          </div>
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500"
            >
              {hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex-1 grid grid-cols-7 min-w-max">
          {/* Day headers */}
          {daysInWeek.map((day) => {
            const dayString = format(day, "yyyy-MM-dd");
            const dayEvents = filteredTimetables.filter((tt) => {
              if (tt.type === "weekly") {
                if (!isWithinValidity(tt, day)) return false;
                return tt.days?.some((d) => d.day === format(day, "EEEE"));
              }
              return tt.days?.some(
                (d) =>
                  d.date && format(new Date(d.date), "yyyy-MM-dd") === dayString
              );
            });
            const isToday =
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <div
                key={day.toString()}
                className={`text-center p-2 border border-gray-200 ${
                  isToday ? "bg-blue-50 font-semibold" : ""
                }`}
              >
                <div className="text-sm text-gray-600">
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-lg ${
                    isToday ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {format(day, "dd")}
                </div>
              </div>
            );
          })}

          {/* Time slots */}
          {timeSlots.map((hour) => (
            <React.Fragment key={hour}>
              {daysInWeek.map((day) => {
                const dayString = format(day, "yyyy-MM-dd");
                const events = filteredTimetables.filter((tt) => {
                  if (tt.type === "weekly") {
                    if (!isWithinValidity(tt, day)) return false;
                    return tt.days?.some(
                      (d) =>
                        d.day === format(day, "EEEE") &&
                        d.slots?.some(
                          (slot) => new Date(slot.startTime).getHours() === hour
                        )
                    );
                  }
                  return tt.days?.some(
                    (d) =>
                      d.date &&
                      format(new Date(d.date), "yyyy-MM-dd") === dayString &&
                      d.slots?.some(
                        (slot) => new Date(slot.startTime).getHours() === hour
                      )
                  );
                });

                // Calculate max duration for this cell
                const maxDuration = events.reduce((max, evt) => {
                  const dayData = evt?.days?.find(
                    (d) =>
                      d.day === format(day, "EEEE") ||
                      (d.date &&
                        format(new Date(d.date), "yyyy-MM-dd") === dayString)
                  );
                  const slotData = dayData?.slots?.find(
                    (s) => new Date(s.startTime).getHours() === hour
                  );
                  if (!slotData) return max;
                  return Math.max(
                    max,
                    calculateCellHeight(slotData.startTime, slotData.endTime)
                  );
                }, 1);

                return (
                  <div
                    key={`${dayString}-${hour}`}
                    className="h-16 border relative"
                    style={{
                      height: `${maxDuration * 64}px`,
                    }}
                  >
                    {/* Badge for multiple events */}
                    {events.length > 1 && (
                      <Badge
                        count={events.length}
                        style={{
                          background:
                            "linear-gradient(135deg, #ff4e8a, #ff80bf)",
                          position: "absolute",
                          top: -14,
                          right: -14,
                          zIndex: 2,
                          fontSize: "10px",
                          height: "16px",
                          minWidth: "16px",
                          lineHeight: "16px",
                          padding: "0 4px",
                          borderRadius: "4px",
                        }}
                      />
                    )}

                    {/* Events container */}
                    <Element
                      name={`${dayString}-${hour}`}
                      className="absolute inset-0 overflow-x-auto scrollbar-thin"
                    >
                      <div className="flex h-full">
                        {events.map((evt, index) => {
                          const dayData = evt?.days?.find(
                            (d) =>
                              d.day === format(day, "EEEE") ||
                              (d.date &&
                                format(new Date(d.date), "yyyy-MM-dd") ===
                                  dayString)
                          );
                          const slotData = dayData?.slots?.find(
                            (s) => new Date(s.startTime).getHours() === hour
                          );

                          if (!slotData) return null;

                          const duration = calculateCellHeight(
                            slotData.startTime,
                            slotData.endTime
                          );
                          const displayText =
                            slotData?.subjectId?.name ||
                            slotData?.eventName ||
                            evt.name;
                          const color = getColorByType(evt.type);
                          const darkerColor = darkenColor(color, 20);

                          // Calculate width based on number of events
                          const eventWidth =
                            events.length > 1
                              ? `${Math.min(50, 100 / events.length)}%`
                              : "100%";

                          // Ensure the height of each event is distributed properly
                          const eventHeight = (duration * 64) / events.length;

                          return (
                            <div
                              key={evt._id}
                              className="flex-shrink-0 flex flex-col overflow-hidden shadow-sm mx-px"
                              style={{
                                width: eventWidth,
                                height: `${eventHeight}px`, // Adjust height based on duration and event count
                                minWidth: "70px",
                              }}
                              onClick={() => onEventClick(evt)}
                            >
                              {/* Header */}
                              <div
                                className="px-2 py-1 text-white text-xs font-medium truncate border-b"
                                style={{ backgroundColor: darkerColor }}
                              >
                                {evt.name}
                              </div>

                              {/* Divider */}
                              <div
                                className="h-px w-full"
                                style={{ backgroundColor: darkerColor }}
                              />

                              {/* Body */}
                              <div
                                className="flex-1 px-2 py-1 text-xs"
                                style={{ backgroundColor: color }}
                              >
                                <div className="text-white font-medium truncate">
                                  {displayText}
                                </div>
                                <div className="text-white text-xxs opacity-80 mt-1">
                                  {dayjs(slotData.startTime).format("h:mm A")} -{" "}
                                  {dayjs(slotData.endTime).format("h:mm A")}
                                </div>
                                {slotData.teacherId?.name && (
                                  <div className="text-white text-xxs opacity-80 mt-1">
                                    {slotData.teacherId.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Element>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to darken a color
function darkenColor(color, percent) {
  if (color.startsWith("#")) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) - amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) - amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000ff) - amt));
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  }
  return color;
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
      return "rgba(255, 153, 204, 0.8)";
    case "exam":
      return "rgba(41, 171, 226, 0.8)";
    case "event":
      return "rgba(119, 221, 119, 0.8)";
    case "others":
      return "rgba(255, 215, 0, 0.8)";
    default:
      return "rgba(211, 211, 211, 0.8)";
  }
}
