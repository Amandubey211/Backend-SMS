import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import announcement from "../../../../../Assets/StudentAssets/announcement.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const localizer = momentLocalizer(moment);

const generateMonthlyEvents = (year, month) => {
  const baseEvents = [
    {
      title: "Math Exam",
      day: 5,
      timeStart: [10, 0],
      timeEnd: [11, 0],
      description: "Algebra & Geometry test.",
    },
    {
      title: "Science Fair",
      day: 12,
      timeStart: [14, 0],
      timeEnd: [16, 0],
      description: "Annual science showcase.",
    },
    {
      title: "Literature Quiz",
      day: 18,
      timeStart: [9, 0],
      timeEnd: [10, 0],
      description: "Shakespeare & poetry quiz.",
    },
  ];

  return baseEvents.map((event, index) => ({
    title: event.title,
    start: new Date(year, month, event.day, ...event.timeStart),
    end: new Date(year, month, event.day, ...event.timeEnd),
    id: index,
    description: event.description,
  }));
};

const StudentEvents = () => {
  const currentDate = new Date();
  const [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [selectedEvents, setSelectedEvents] = useState([]);

  const events = generateMonthlyEvents(year, monthIndex);
  const eventDates = new Set(
    events.map((event) => moment(event.start).format("YYYY-MM-DD"))
  );

  const dayPropGetter = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");

    if (eventDates.has(formattedDate)) {
      return {
        className: "event-day",
        onClick: () => handleDateClick(date), // Attach click event
      };
    }
    return {};
  };

  const handleMonthChange = (direction) => {
    let newMonth = monthIndex + direction;
    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setMonthIndex(newMonth);
    setYear(newYear);
    setSelectedEvents([]); // Reset selected events when changing month
  };

  const handleDateClick = (date) => {
    const filteredEvents = events.filter(
      (e) =>
        moment(e.start).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
    );
    setSelectedEvents(filteredEvents);
  };

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex justify-center items-center gap-8 p-4 bg-gray-100 rounded-lg mb-2">
        <button
          className="p-1 border rounded-full hover:bg-purple-500 hover:text-white"
          onClick={() => handleMonthChange(1)}
        >
          <IoIosArrowBack />
        </button>
        <h2 className="text-sm font-semibold">
          {moment({ year, month: monthIndex }).format("MMMM YYYY")}
        </h2>

        <button
          className="p-1 border rounded-full hover:bg-purple-500 hover:text-white"
          onClick={() => handleMonthChange(1)}
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Calendar Component */}
      <div className="bg-white rounded-lg">
        <Calendar
          localizer={localizer}
          events={[]} // Hides event titles on dates
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          selectable
          dayPropGetter={dayPropGetter}
          date={new Date(year, monthIndex)}
          style={{
            height: 300,
            fontSize: 12,
            // borderRadius: "10px",
            border: "none",
            // backgroundColor: "#fef9f8",
          }}
          toolbar={false}
        />
      </div>

      {/* Display Selected Events */}
      {selectedEvents.length > 0 ? (
        selectedEvents.map((event) => (
          <div
            key={event.id}
            className="mt-3 p-3 rounded-lg bg-purple-100 flex items-center gap-2"
          >
            <img
              src={announcement}
              alt="Event"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-md font-semibold text-purple-700">
                {event.title}
              </h3>
              <h3 className="text-xs font-semibold text-gray-600">
                {moment(selectedEvents[0].start).format("ddd, MMM D, YYYY")} ({" "}
                {moment(event.start).format("hh:mm A")} -{" "}
                {moment(event.end).format("hh:mm A")})
              </h3>
              {/* <p className="text-sm text-gray-600">
                {moment(event.start).format("hh:mm A")} -{" "}
                {moment(event.end).format("hh:mm A")}
              </p> */}

              <p className="text-gray-500 text-xs">{event.description}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-4 p-6 text-center text-gray-500 text-sm bg-gray-100 rounded-lg">
          No Event Found
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
          .event-day {
            position: relative;
            text-align: center;
            cursor:pointer;
          }
     
          .rbc-month-view {
            border-radius: 10px;
            background: linear-gradient(to bottom, #ffeff1, #e3f2fd);
            padding: 10px;
          }
          .rbc-header {
            font-weight:bold;
            color: #6a0572;
            font-size: 12px;
            text-align: center;
          }
          .rbc-today {
            background-color: rgba(255, 182, 193, 0.4) !important;
            border-radius: 8px;
          }
          .rbc-date-cell {
            display: flex;
            top:16px;
            left:2px;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            position: relative;
          }  
          .event-day::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35px;
  height: 35px;
  background-color: rgba(128, 0, 128, 0.3);
  border-radius: 50%;
  pointer-events: none; /* Allows clicks to pass through to the date */
}

.event-day span {
  position: relative;
  z-index: 2; /* Ensure date number is on top and clickable */
  cursor: pointer;
}
                
     `}
      </style>
    </div>
  );
};
export default StudentEvents;
