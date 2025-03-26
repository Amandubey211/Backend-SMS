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

  // Full 24-hour timeline
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 64; // Fixed height for each hour slot

  // Function to calculate exact event position and height
  const calculateEventPosition = (startTime, endTime) => {
    if (!startTime || !endTime) return { height: hourHeight, top: 0 };

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Calculate minutes from start of day
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    const top = (startMinutes / 60) * hourHeight;
    const height = ((endMinutes - startMinutes) / 60) * hourHeight;

    return {
      height: Math.max(hourHeight / 4, height), // Minimum height of 15 minutes
      top,
    };
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
        {/* Time column - Full 24-hour timeline */}
        <div
          className="w-16 flex-shrink-0"
          style={{ height: `${24 * hourHeight + 40}px` }}
        >
          <div className="h-16  border-gray-200 flex justify-center items-center text-2xl">
            <TfiTime />
          </div>
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="flex border items-start justify-end pr-2 text-xs text-gray-500"
              style={{ height: `${hourHeight}px` }}
            >
              {hour === 0
                ? "12 AM"
                : hour < 12
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
            const isToday =
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <div
                key={day.toString()}
                className={`text-center p-2 border-t border-l border-b border-gray-200 ${
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

          {/* Time slots container */}
          <div
            className="col-span-7 relative"
            style={{ height: `${24 * hourHeight}px` }}
          >
            {/* Background grid lines */}
            {timeSlots.map((hour) => (
              <div
                key={`grid-${hour}`}
                className="border-b border-gray-200 absolute w-full"
                style={{
                  top: `${hour * hourHeight}px`,
                  height: `${hourHeight}px`,
                }}
              ></div>
            ))}

            {/* Events */}
            {daysInWeek.map((day, dayIndex) => {
              const dayString = format(day, "yyyy-MM-dd");
              const events = filteredTimetables.flatMap((tt) => {
                const dayData = tt.days?.find(
                  (d) =>
                    d.day === format(day, "EEEE") ||
                    (d.date &&
                      format(new Date(d.date), "yyyy-MM-dd") === dayString)
                );

                if (!dayData) return [];

                return (
                  dayData.slots?.map((slot) => ({
                    ...tt,
                    slot,
                    dayIndex,
                  })) || []
                );
              });

              // Group events by their time slot
              const eventGroups = {};
              events.forEach((evt) => {
                const hour = new Date(evt.slot.startTime).getHours();
                const key = `${dayIndex}-${hour}`;
                if (!eventGroups[key]) {
                  eventGroups[key] = [];
                }
                eventGroups[key].push(evt);
              });

              return (
                <React.Fragment key={dayString}>
                  {Object.entries(eventGroups).map(([key, groupEvents]) => {
                    const firstEvent = groupEvents[0];
                    const { height, top } = calculateEventPosition(
                      firstEvent.slot.startTime,
                      firstEvent.slot.endTime
                    );

                    return (
                      <div
                        key={key}
                        className="absolute"
                        style={{
                          left: `${(dayIndex / 7) * 100}%`,
                          width: "calc(100% / 7 - 8px)",
                          height: `${height}px`,
                          top: `${top}px`,
                        }}
                      >
                        {/* Badge for multiple events */}
                        {groupEvents.length > 1 && (
                          <Badge
                            count={groupEvents.length}
                            style={{
                              backgroundColor: "#1890ff",
                              position: "absolute",
                              top: 0,
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

                        {/* Horizontal scroll container for events */}
                        <Element
                          name={`${dayString}-${key}`}
                          className="h-full overflow-x-auto scrollbar-thin"
                        >
                          <div
                            className="flex h-full"
                            style={{
                              minWidth: `${groupEvents.length * 150}px`,
                            }}
                          >
                            {groupEvents.map((evt) => {
                              const displayText =
                                evt.slot?.subjectId?.name ||
                                evt.slot?.eventName ||
                                evt.name;
                              const color = getColorByType(evt.type);
                              const darkerColor = darkenColor(color, 20);

                              return (
                                <motion.div
                                  key={evt._id}
                                  className="flex-shrink-0 flex flex-col overflow-hidden shadow-sm mx-px relative cursor-pointer"
                                  style={{
                                    width:
                                      groupEvents.length === 1
                                        ? "150px"
                                        : "70px",
                                    height: "100%",
                                  }}
                                  onClick={() => onEventClick(evt)}
                                  whileHover={{
                                    // scale: 1.05,
                                    zIndex: 10,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    transition: { duration: 0.2 },
                                  }}
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
                                      {dayjs(evt.slot.startTime).format(
                                        "h:mm A"
                                      )}{" "}
                                      -{" "}
                                      {dayjs(evt.slot.endTime).format("h:mm A")}
                                    </div>
                                    {evt.slot.teacherId?.name && (
                                      <div className="text-white text-xxs opacity-80 mt-1">
                                        {evt.slot.teacherId.name}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </Element>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
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
