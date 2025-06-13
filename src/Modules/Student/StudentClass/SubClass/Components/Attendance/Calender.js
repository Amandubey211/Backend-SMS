import React from "react";
import ReactCalendar from "react-calendar";
import { Select } from "antd";
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../../../Utils/translator/translation";

const { Option } = Select;

// Custom CSS for React-Calendar with improved UI
const calendarStyles = `
  .react-calendar {
    width: 100%;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #fff;
  }
  .react-calendar__month-view__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0; /* Remove gap to allow borders to form a continuous grid */
  }
  .react-calendar__tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    min-height: 80px;
    border-radius: 0; /* Remove border-radius for tiles to form a grid */
    font-size: 16px; /* Increase date number font size */
    transition: background-color 0.2s;
  }
  .react-calendar__tile:hover {
    background-color: #f5f5f5 !important; /* Light gray for non-current dates */
  }
  .react-calendar__tile--now:hover {
    background-color: #e6f7ff !important; /* Light blue hover color for current date */
  }
  .react-calendar__tile--active,
  .react-calendar__tile--now {
    background: #b1d2d0; /* Lighter blue for active/current date */
    color: white;
    border-radius: 8px; /* Keep border-radius for the highlighted tile */
  }
  .react-calendar__month-view__weekdays__weekday {
    text-align: center;
    font-weight: 600;
    color: #595959;
    padding: 10px 0; /* Match padding with tiles for consistent height */
    min-height: 40px; /* Ensure consistent height */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Ensure the top row of tiles doesn't have a top border to avoid double line */

  .react-calendar__navigation {
    display: none; /* Hide default navigation since we're using dropdowns */
  }
  .status-container {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .status-icon {
    font-size: 16px;
  }
  .status-text {
    font-size: 12px;
    color: #000;
  }
`;

const getStatusIcon = (status) => {
  switch (status) {
    case "present":
      return <FaCheckCircle className="text-green-500 status-icon" />;
    case "absent":
      return <FaTimesCircle className="text-red-500 status-icon" />;
    case "leave":
      return <FaMinusCircle className="text-purple-500 status-icon" />;
    default:
      return null;
  }
};

const CalendarHeader = ({ attendanceData, onMonthChange, onYearChange, yearList, selectedMonth, selectedYear }) => {
  const { t } = useTranslation();

  // Compute the calendar value (13th of the selected month and year)
  const today = new Date(); // Today is June 13, 2025
  const currentDay = today.getDate(); // 13

  // Create a Date object for the 13th of the selected month and year
  const calendarValue = new Date(selectedYear, selectedMonth, currentDay);

  // Format date to YYYY-MM-DD for comparison with attendanceData
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Render attendance data on calendar tiles
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null; // Only render for month view

    const dateStr = formatDate(date);
    const status = attendanceData[dateStr];
    if (!status) return null;

    return (
      <div className="status-container">
        {getStatusIcon(status)}
        <span className="status-text capitalize">{status}</span>
      </div>
    );
  };

  // Month and year dropdowns
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="w-full">
      {/* Add custom styles */}
      <style>{calendarStyles}</style>

      {/* Month and Year Dropdowns using antd Select */}
      <div className="flex justify-end items-center mb-6 space-x-3">
        <Select
          style={{ width: 120, fontSize: "14px" }}
          value={selectedMonth}
          onChange={onMonthChange}
          dropdownStyle={{ minWidth: 120 }}
        >
          {months.map((monthName, index) => (
            <Option key={monthName} value={index}>
              {t(monthName, gt.month)}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 100, fontSize: "14px" }}
          value={selectedYear}
          onChange={onYearChange}
          dropdownStyle={{ minWidth: 100 }}
        >
          {yearList?.map((yr) => (
            <Option key={yr} value={yr}>
              {yr}
            </Option>
          ))}
        </Select>
      </div>

      {/* React-Calendar Component */}
      <ReactCalendar
        value={calendarValue}
        view="month"
        tileContent={tileContent}
      />
    </div>
  );
};

export default CalendarHeader;