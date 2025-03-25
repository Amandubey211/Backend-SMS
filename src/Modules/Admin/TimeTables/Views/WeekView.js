import React from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { motion } from "framer-motion";

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

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <motion.div
      key="weekView"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="p-4 overflow-x-auto"
    >
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
      <h3 className="text-xl font-bold mb-4">
        Week of {format(daysInWeek[0], "dd MMM")} -{" "}
        {format(daysInWeek[6], "dd MMM")}
      </h3>
      <div className="flex min-w-max">
        <div className="w-16 mr-2 flex-shrink-0">
          <div className="h-10 border-b"></div>
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b flex items-start justify-end pr-2 text-sm text-gray-500"
            >
              {`${hour}:00`}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 gap-1 min-w-max">
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
            const density = Math.min(dayEvents.length / 5, 1);
            const bgColor = `rgba(66, 153, 225, ${0.2 + density * 0.3})`;

            return (
              <div
                key={day.toString()}
                className="text-center font-medium p-2 border-b relative"
              >
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: bgColor }}
                />
                {format(day, "EEE dd")}
              </div>
            );
          })}
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

                return (
                  <div
                    key={`${dayString}-${hour}`}
                    className="h-16 border-b relative"
                  >
                    {events.map((evt) => {
                      const dayData = evt.days.find(
                        (d) =>
                          d.day === format(day, "EEEE") ||
                          (d.date &&
                            format(new Date(d.date), "yyyy-MM-dd") ===
                              dayString)
                      );
                      const slotData = dayData?.slots?.find(
                        (s) => new Date(s.startTime).getHours() === hour
                      );
                      const displayText =
                        slotData?.subjectId?.name ||
                        slotData?.eventName ||
                        evt.name;

                      return (
                        <div
                          key={evt._id}
                          className="absolute top-1 left-1 right-1 bottom-1 rounded cursor-pointer flex flex-col p-1"
                          style={{
                            backgroundColor: getColorByType(evt.type),
                            zIndex: 1,
                          }}
                          onClick={() => onEventClick(evt)}
                        >
                          <div className="text-white text-xs font-medium truncate">
                            {displayText}
                          </div>
                          <div className="text-white text-xxs mt-auto">
                            {slotData &&
                              `${
                                dayjs(slotData.startTime).isValid()
                                  ? dayjs(slotData.startTime).format("HH:mm")
                                  : "N/A"
                              } - ${
                                dayjs(slotData.endTime).isValid()
                                  ? dayjs(slotData.endTime).format("HH:mm")
                                  : "N/A"
                              }`}
                          </div>
                        </div>
                      );
                    })}
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
