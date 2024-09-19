import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
  // Function to handle date changes
  const onChange = (newDate) => {
    const adjustedDate = new Date(
      newDate.getTime() + Math.abs(newDate.getTimezoneOffset() * 60000)
    );
    setSelectedDate(adjustedDate); // Use the setSelectedDate from props
  };

  const tileDisabled = ({ date, view }) => {
    // Disable dates after today
    if (view === "month") {
      const today = new Date();
      return date > today;
    }
    return false;
  };

  return (
    <div className="custom-calendar">
      <Calendar
        onChange={onChange}
        value={selectedDate} // Use selectedDate from props
        tileDisabled={tileDisabled}
        className="w-full"
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) => date.toString().slice(0, 2)}
      />
    </div>
  );
};

export default CustomCalendar;
