// import React from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
//   // Function to handle date changes
//   const onChange = (newDate) => {
//     const adjustedDate = new Date(
//       newDate.getTime() + Math.abs(newDate.getTimezoneOffset() * 60000)
//     );
//     setSelectedDate(adjustedDate); // Use the setSelectedDate from props
//   };

//   const tileDisabled = ({ date, view }) => {
//     // Disable dates after today
//     if (view === "month") {
//       const today = new Date();
//       return date > today;
//     }
//     return false;
//   };

//   return (
//     <div className="custom-calendar">
//       <Calendar
//         onChange={onChange}
//         value={selectedDate} // Use selectedDate from props
//         tileDisabled={tileDisabled}
//         className="w-full"
//         next2Label={null}
//         prev2Label={null}
//         formatShortWeekday={(locale, date) => date?.toString()?.slice(0, 2)}
//       />
//     </div>
//   );
// };

// export default CustomCalendar;

// ------------------ Ant Design Calander UI --------------------------------
import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";

/**
 * CustomCalendar component using Ant Design + Tailwind CSS
 */
const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
  const dayjsSelected = dayjs(selectedDate);
  const dayjsToday = dayjs();

  /**
   * Fully override each date cell:
   * - "Future" dates styled with a gray background, gap, and no hover
   * - "Selected" date highlighted in blue
   * - "Today" gets a subtle border if not selected
   */
  const dateFullCellRender = (current) => {
    // Check if date is after "today" (future)
    const isFuture = current.isAfter(dayjsToday, "day");

    // Highlight the date if it matches the selected date (day-only)
    // Remove `&& !isFuture` so we can see the highlight properly
    const isSelected = current.isSame(dayjsSelected, "day");

    // Special styling for "today" (if not selected)
    const isToday = current.isSame(dayjsToday, "day");

    return (
      <div
        className={`
          flex items-center justify-center
          w-8 h-8 m-0.5 rounded
          transition-all duration-200
          ${
            // Future dates are visually disabled
            isFuture
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : // Past & present dates: hover transform, clickable cursor
                "bg-white text-black cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
          }
          ${
            // Selected date highlight
            isSelected
              ? "bg-green-600 border text-black font-semibold shadow-md"
              : ""
          }
          ${
            // If it's today but not selected, show a thin border
            isToday && !isSelected ? "border border-blue-500" : ""
          }
        `}
      >
        {current.date()}
      </div>
    );
  };

  /**
   * `disabledDate` ensures future dates can't be clicked.
   */
  const disabledDate = (current) => {
    return current.isAfter(dayjsToday, "day");
  };

  /**
   * Handle valid date selection
   */
  const handleSelect = (value) => {
    setSelectedDate(value.toDate());
  };

  return (
    <div
      className="
        mx-auto w-full max-w-sm p-4 border border-gray-200 rounded
        bg-white shadow-lg
        transition-all duration-200
      "
    >
      <Calendar
        fullscreen={false}
        value={dayjsSelected}
        onSelect={handleSelect}
        dateFullCellRender={dateFullCellRender}
        disabledDate={disabledDate}
      />
    </div>
  );
};

export default CustomCalendar;
