import React from "react";
import { Skeleton } from "antd";
import { AnimatePresence } from "framer-motion";
import WeekView from "../../../Admin/TimeTables/Views/WeekView";
import DayView from "../../../Admin/TimeTables/Views/DayView";
import MonthView from "../../../Admin/TimeTables/Views/MonthView";

/**
 * Component that renders the appropriate timetable view based on viewMode
 * @param {Object} props - Component props
 */
const TimetableViews = ({
  loadingFetch,
  loadingChildren,
  role,
  viewMode,
  selectedDate,
  filteredTimetables,
  onEventClick,
  setSelectedDate,
  t,
}) => {
  // Loading state
  if (loadingFetch || (role === "parent" && loadingChildren)) {
    return (
      <div className="space-y-4">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {viewMode === "day" && (
        <DayView
          selectedDate={selectedDate}
          filteredTimetables={filteredTimetables}
          onEventClick={onEventClick}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          selectedDate={selectedDate}
          filteredTimetables={filteredTimetables}
          onEventClick={onEventClick}
          onDateChange={setSelectedDate}
        />
      )}
      {viewMode === "month" && (
        <MonthView
          selectedDate={selectedDate}
          filteredTimetables={filteredTimetables}
          onEventClick={onEventClick}
          setSelectedDate={setSelectedDate}
        />
      )}
    </AnimatePresence>
  );
};

export default TimetableViews;
