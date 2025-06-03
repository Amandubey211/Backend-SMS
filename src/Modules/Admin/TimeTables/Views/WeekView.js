import React from "react";
import { format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Badge, Tooltip, Empty } from "antd";
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

  // Full 24-hour timeline with AM/PM format
  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    display: `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`,
    isAM: i < 12,
  }));

  const hourHeight = 64; // Fixed height for each hour slot

  // Function to check if a day is within timetable's validity period
  const isDayWithinValidity = (day, timetable) => {
    if (!timetable.validity) return true;
    const { startDate, endDate } = timetable.validity;
    if (!startDate || !endDate) return true;

    return isWithinInterval(day, {
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
  };

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

  // Get events for a specific day that are within validity period
  const getEventsForDay = (day, timetable) => {
    if (!isDayWithinValidity(day, timetable)) return [];

    const dayString = format(day, "yyyy-MM-dd");
    const dayName = format(day, "EEEE");

    const dayData = timetable.days?.find(
      (d) =>
        d.day === dayName ||
        (d.date && format(new Date(d.date), "yyyy-MM-dd") === dayString)
    );

    if (!dayData?.slots) return [];

    return dayData.slots.map((slot) => ({
      ...timetable,
      slot,
      dayData,
    }));
  };

  // Function to detect overlapping events and assign z-index
  const organizeEvents = (events) => {
    if (events.length === 0) return [];

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
      const aStart = new Date(a.slot.startTime).getTime();
      const bStart = new Date(b.slot.startTime).getTime();
      return aStart - bStart;
    });

    const organized = [];
    const layers = [];

    sortedEvents.forEach((event) => {
      const eventStart = new Date(event.slot.startTime).getTime();
      const eventEnd = new Date(event.slot.endTime).getTime();

      // Find the first layer where this event doesn't overlap with existing events
      let layerIndex = 0;
      while (layerIndex < layers.length) {
        const layer = layers[layerIndex];
        const overlaps = layer.some(
          (existingEvent) =>
            eventStart < new Date(existingEvent.slot.endTime).getTime() &&
            eventEnd > new Date(existingEvent.slot.startTime).getTime()
        );
        if (!overlaps) break;
        layerIndex++;
      }

      // Create new layer if needed
      if (layerIndex >= layers.length) {
        layers.push([]);
      }

      // Add event to layer
      layers[layerIndex].push(event);

      // Store with z-index (higher for later layers)
      organized.push({
        ...event,
        zIndex: layerIndex + 1, // Start from 1 to avoid issues with other elements
      });
    });

    return organized;
  };

  return (
    <motion.div
      key="weekView"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="p-4 overflow-x-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">
          Week of {format(daysInWeek[0], "dd MMM")} -{" "}
          {format(daysInWeek[6], "dd MMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="border rounded p-1 text-sm"
          />
        </div>
      </div>

      <div className="flex min-w-max bg-white rounded-lg shadow">
        {/* Time column - Full 24-hour timeline */}
        <div
          className="w-24 flex-shrink-0"
          style={{ height: `${24 * hourHeight + 64}px` }}
        >
          {/* Changed height from h-20 to h-16 to better match day headers */}
          <div className="h-24 border border-gray-200 flex justify-center items-center">
            <TfiTime className="text-lg" />
          </div>
          {timeSlots.map((slot) => (
            <div
              key={slot.hour}
              className="flex border-b border-r border-gray-200 items-center justify-end pr-2 text-sm"
              style={{
                height: `${hourHeight}px`,
                color: slot.isAM ? "#4a5568" : "#2d3748",
              }}
            >
              {slot.display}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex-1 grid grid-cols-7 min-w-max ">
          {/* Day headers */}
          {daysInWeek.map((day) => {
            const dayString = format(day, "yyyy-MM-dd");
            const isToday = isSameDay(day, new Date());
            const isWeekend = [0, 6].includes(day.getDay());
            const dayEvents = filteredTimetables.flatMap((tt) =>
              getEventsForDay(day, tt)
            );

            return (
              <div
                key={dayString}
                className={`text-center p-2 border-t border-r border-b h-24 border-gray-200 ${
                  isToday ? "bg-blue-50 font-semibold" : ""
                } ${isWeekend ? "bg-gray-50" : ""}`}
              >
                <div
                  className={`text-sm ${
                    isWeekend ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-lg ${
                    isToday
                      ? "text-blue-600"
                      : isWeekend
                      ? "text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {format(day, "dd")}
                </div>
                {dayEvents.length > 0 && (
                  <Badge
                    count={dayEvents.length}
                    size="small"
                    className="mt-1"
                    style={{ backgroundColor: "#3B82F6" }}
                  />
                )}
              </div>
            );
          })}

          {/* Time slots container */}
          <div
            className="col-span-7 relative"
            style={{ height: `${24 * hourHeight}px` }}
          >
            {/* Background grid lines */}
            {timeSlots.map((slot) => (
              <div
                key={`grid-${slot.hour}`}
                className="border-b border-gray-200 absolute w-full"
                style={{
                  top: `${slot.hour * hourHeight}px`,
                  height: `${hourHeight}px`,
                }}
              ></div>
            ))}

            {/* Events */}
            {daysInWeek.map((day, dayIndex) => {
              const dayString = format(day, "yyyy-MM-dd");
              const isWeekend = [0, 6].includes(day.getDay());

              // Get all events for this day across all timetables
              const events = filteredTimetables.flatMap((tt) => {
                if (!isDayWithinValidity(day, tt)) return [];
                return getEventsForDay(day, tt);
              });

              // Organize events with proper z-index for overlapping
              const organizedEvents = organizeEvents(events);

              return (
                <React.Fragment key={dayString}>
                  {organizedEvents.map((event) => {
                    const { height, top } = calculateEventPosition(
                      event.slot.startTime,
                      event.slot.endTime
                    );

                    const displayText =
                      event.slot?.subjectId?.name ||
                      event.slot?.eventName ||
                      event.name;
                    const color = getColorByType(event.type);
                    const darkerColor = darkenColor(color, 20);

                    return (
                      <motion.div
                        key={`${dayString}-${event._id}`}
                        className="absolute flex-shrink-0 flex flex-col overflow-hidden shadow-sm mx-px cursor-pointer"
                        style={{
                          left: `${(dayIndex / 7) * 100}%`,
                          width: "calc(100% / 7 - 8px)",
                          height: `${height}px`,
                          top: `${top}px`,
                          zIndex: event.zIndex,
                        }}
                        onClick={() => onEventClick(event)}
                        whileHover={{
                          zIndex: 100, // Higher than all other events when hovered
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          transition: { duration: 0.2 },
                        }}
                      >
                        {/* Header */}
                        <div
                          className="px-2 py-1 text-white text-xs font-medium truncate border-b"
                          style={{ backgroundColor: darkerColor }}
                        >
                          {event.name}
                        </div>

                        {/* Body */}
                        <div
                          className="flex-1 px-2 py-1 text-xs"
                          style={{ backgroundColor: color }}
                        >
                          <div className="text-white font-medium truncate">
                            {displayText}
                          </div>
                          <div className="text-white text-xxs opacity-80 mt-1">
                            {dayjs(event.slot.startTime).format("h:mm A")} -{" "}
                            {dayjs(event.slot.endTime).format("h:mm A")}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* Empty state */}
            {filteredTimetables.length > 0 &&
              filteredTimetables.every(
                (tt) => !daysInWeek.some((day) => isDayWithinValidity(day, tt))
              ) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No events within validity period for this week"
                  />
                </div>
              )}
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

function getColorByType(type) {
  switch (type) {
    // case "weekly":
    //   return "rgba(255, 153, 204, 0.8)";
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
