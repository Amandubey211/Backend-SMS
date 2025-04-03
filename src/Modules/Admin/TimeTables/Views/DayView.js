import React from "react";
import { format, isSameDay, parseISO } from "date-fns";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";

// Constant for hour slot height (in pixels)
const HOUR_HEIGHT = 64;

export default function DayView({
  selectedDate,
  filteredTimetables,
  onEventClick,
}) {
  const dayName = format(selectedDate, "EEEE");
  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Create time slots for all 24 hours with AM/PM formatting
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12; // Convert 0 to 12 for 12-hour format
    const period = i < 12 ? "AM" : "PM";
    return {
      hour24: i,
      display: `${hour}:00 ${period}`,
      isCurrentHour:
        new Date().getHours() === i && isSameDay(new Date(), selectedDate),
    };
  });

  // Get all events for the selected date
  const getEventsForDate = () => {
    return filteredTimetables.flatMap((timetable) => {
      return timetable.days
        .filter((day) => {
          if (timetable.type === "weekly") {
            return day.day === dayName;
          }
          return day.date && isSameDay(parseISO(day.date), selectedDate);
        })
        .flatMap((day) => {
          return (
            day.slots?.map((slot) => {
              const startTime = new Date(slot.startTime);
              const endTime = new Date(slot.endTime);
              const durationMinutes = (endTime - startTime) / (1000 * 60);

              console.log("Event details:", {
                name: slot.subjectId?.name || slot.eventName || timetable.name,
                startTime: startTime.toString(),
                endTime: endTime.toString(),
                durationMinutes: durationMinutes,
                heightPixels: (durationMinutes / 60) * HOUR_HEIGHT,
              });

              return {
                ...timetable,
                slotData: slot,
                dayData: day,
                startTime,
                endTime,
                startHour: startTime.getHours(),
                endHour: endTime.getHours(),
                minutesFromDayStart:
                  startTime.getHours() * 60 + startTime.getMinutes(),
                durationMinutes: durationMinutes,
              };
            }) || []
          );
        });
    });
  };

  const events = getEventsForDate();

  // Group overlapping events
  const groupOverlappingEvents = (events) => {
    if (events.length === 0) return [];

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => a.startTime - b.startTime);

    const groups = [];
    let currentGroup = [sortedEvents[0]];

    for (let i = 1; i < sortedEvents.length; i++) {
      const lastEventInGroup = currentGroup[currentGroup.length - 1];
      const currentEvent = sortedEvents[i];

      if (currentEvent.startTime < lastEventInGroup.endTime) {
        // Events overlap, add to current group
        currentGroup.push(currentEvent);
      } else {
        // No overlap, start new group
        groups.push(currentGroup);
        currentGroup = [currentEvent];
      }
    }

    // Push the last group
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    console.log("Event groups:", groups);
    return groups;
  };

  // Calculate event height in pixels
  const calculateEventHeight = (durationMinutes) => {
    return (durationMinutes / 60) * HOUR_HEIGHT;
  };

  // Calculate event top position in pixels
  const calculateEventTop = (minutesFromDayStart) => {
    return (minutesFromDayStart / 60) * HOUR_HEIGHT;
  };

  return (
    <motion.div
      key="dayView"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="p-4 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      <div className="sticky top-0 bg-white z-10 pb-2">
        <h3 className="text-xl font-bold">
          {format(selectedDate, "EEEE, dd MMM yyyy")}
        </h3>
        <div className="text-sm text-gray-500">
          {events.length} {events.length === 1 ? "event" : "events"} scheduled
        </div>
      </div>

      <div className="flex mt-2">
        {/* Time column */}
        <div className="w-20 flex-shrink-0">
          {timeSlots.map((slot) => (
            <div
              key={slot.hour24}
              className={`border-b flex items-center justify-end pr-2 text-sm ${
                slot.isCurrentHour ? "bg-blue-50 font-semibold" : ""
              }`}
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span
                className={
                  slot.hour24 >= 12 ? "text-gray-800" : "text-gray-600"
                }
              >
                {slot.display}
              </span>
            </div>
          ))}
        </div>

        {/* Events column */}
        <div
          className="flex-1 min-w-0 border-l relative"
          style={{ height: `${24 * HOUR_HEIGHT}px` }}
        >
          {/* Time slot background markers */}
          {timeSlots.map((slot) => (
            <div
              key={slot.hour24}
              className={`border-b ${slot.isCurrentHour ? "bg-blue-50" : ""}`}
              style={{ height: `${HOUR_HEIGHT}px` }}
            />
          ))}

          {/* Render event groups */}
          {groupOverlappingEvents(events).map((group, groupIndex) => {
            // Find the longest event in the group for container height
            const longestEvent = group.reduce(
              (longest, event) =>
                event.durationMinutes > longest.durationMinutes
                  ? event
                  : longest,
              group[0]
            );

            const groupTop = calculateEventTop(group[0].minutesFromDayStart);
            const groupHeight = calculateEventHeight(
              longestEvent.durationMinutes
            );

            console.log("Rendering group:", {
              groupIndex,
              groupTop,
              groupHeight,
              eventCount: group.length,
              longestEvent:
                longestEvent.slotData?.subjectId?.name ||
                longestEvent.slotData?.eventName ||
                longestEvent.name,
            });

            return (
              <div
                key={`group-${groupIndex}`}
                className="flex absolute w-full"
                style={{
                  top: `${groupTop}px`,
                  height: `${groupHeight}px`,
                }}
              >
                {group.map((event) => {
                  const displayText =
                    event.slotData?.subjectId?.name ||
                    event.slotData?.eventName ||
                    event.name;

                  const teachers = event.slotData?.subjectId?.teacherIds || [];
                  const subjectIcon = (
                    <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                      {displayText.charAt(0).toUpperCase()}
                    </div>
                  );

                  return (
                    <Tooltip
                      key={`${event._id}-${event.slotData._id}`}
                      title={
                        <div>
                          <div className="font-semibold mb-1">
                            {displayText}
                          </div>
                          <div className="flex items-center mb-1">
                            <span className="text-xs text-gray-600">
                              {dayjs(event.slotData.startTime).format("h:mm A")}{" "}
                              - {dayjs(event.slotData.endTime).format("h:mm A")}
                            </span>
                          </div>
                          {teachers.length > 0 && (
                            <div className="mb-1">
                              <div className="text-xs font-medium text-gray-700">
                                Teachers:
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {teachers.map((teacher) => (
                                  <div
                                    key={teacher._id}
                                    className="flex items-center text-xs"
                                  >
                                    {teacher.profile ? (
                                      <img
                                        src={teacher.profile}
                                        alt={teacher.fullName}
                                        className="w-4 h-4 rounded-full mr-1"
                                      />
                                    ) : (
                                      <UserOutlined className="mr-1" />
                                    )}
                                    {teacher.fullName}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {event.type === "weekly"
                              ? "Recurring weekly"
                              : "One-time event"}
                          </div>
                        </div>
                      }
                    >
                      <div
                        className={`p-2 rounded cursor-pointer flex hover:opacity-90 transition-opacity mr-1 ${
                          group.length > 1 ? "flex-1" : "w-full"
                        }`}
                        style={{
                          backgroundColor: getColorByType(event.type),
                          zIndex: 1,
                          height: `${calculateEventHeight(
                            event.durationMinutes
                          )}px`,
                          minHeight: "100%", // Ensure events fill the group height
                        }}
                        onClick={() => onEventClick(event)}
                      >
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center">
                            {subjectIcon}
                            <div className="text-white text-sm font-medium truncate">
                              {displayText}
                            </div>
                          </div>
                          {teachers.length > 0 && (
                            <div className="flex items-center mt-1">
                              {teachers[0].profile ? (
                                <img
                                  src={teachers[0].profile}
                                  alt={teachers[0].fullName}
                                  className="w-4 h-4 rounded-full mr-1"
                                />
                              ) : (
                                <UserOutlined className="text-white text-xs mr-1" />
                              )}
                              <div className="text-white text-xxs truncate">
                                {teachers[0].fullName}
                                {teachers.length > 1 &&
                                  ` +${teachers.length - 1}`}
                              </div>
                            </div>
                          )}
                          <div className="text-white text-xxs mt-1">
                            {dayjs(event.slotData.startTime).format("h:mm A")} -{" "}
                            {dayjs(event.slotData.endTime).format("h:mm A")}
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
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
