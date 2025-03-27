import React from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Badge, Tooltip } from "antd";

export default function DayView({
  selectedDate,
  filteredTimetables,
  onEventClick,
}) {
  const dayName = format(selectedDate, "EEEE");
  const dateString = format(selectedDate, "yyyy-MM-dd");

  const events = filteredTimetables.filter((t) =>
    t?.days?.some(
      (d) => d?.date && format(new Date(d?.date), "yyyy-MM-dd") === dateString
    )
  );

  const slots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    events: events.filter((e) =>
      e?.days.some((d) => {
        if (!d?.date) return false;
        const dateMatch =
          format(new Date(d?.date), "yyyy-MM-dd") === dateString;
        const slotMatch = d?.slots?.some(
          (slot) => new Date(slot.startTime).getHours() === i
        );
        return dateMatch && slotMatch;
      })
    ),
  }));

  return (
    <motion.div
      key="dayView"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="p-4 overflow-x-auto"
    >
      <h3 className="text-xl font-bold mb-4">
        {format(selectedDate, "EEEE, dd MMM yyyy")}
      </h3>
      <div className="flex">
        <div className="w-16 flex-shrink-0">
          {slots.map((slot) => (
            <div
              key={slot.hour}
              className="h-16 border-b flex items-center justify-end pr-2 text-sm text-gray-500"
            >
              {`${slot.hour}:00`}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          {slots.map((slot) => (
            <div key={slot.hour} className="h-16 border-b relative">
              {slot.events.map((evt) => {
                const dayData = evt.days.find(
                  (d) =>
                    d.date &&
                    format(new Date(d.date), "yyyy-MM-dd") === dateString
                );
                const slotData = dayData?.slots?.find(
                  (s) => new Date(s.startTime).getHours() === slot.hour
                );
                const displayText =
                  slotData?.subjectId?.name || slotData?.eventName || evt.name;

                return (
                  <div
                    key={evt?._id}
                    className="absolute top-1 left-1 right-1 bottom-1 p-1 rounded cursor-pointer flex flex-col"
                    style={{ backgroundColor: getColorByType(evt?.type) }}
                    onClick={() => onEventClick(evt)}
                  >
                    <div className="text-white text-xs font-medium truncate">
                      {displayText}
                    </div>
                    <div className="text-white text-xxs mt-auto">
                      {dayjs(slotData?.startTime).isValid()
                        ? dayjs(slotData?.startTime).format("HH:mm")
                        : "N/A"}{" "}
                      -{" "}
                      {dayjs(slotData?.endTime).isValid()
                        ? dayjs(slotData?.endTime).format("HH:mm")
                        : "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
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
