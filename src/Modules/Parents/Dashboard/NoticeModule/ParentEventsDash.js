import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import announcement from "../../../../Assets/StudentAssets/announcement.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { fetchAllEvents } from "../../../../Store/Slices/Parent/Events/event.action";

const localizer = momentLocalizer(moment);

// Define a list of light/pastel Tailwind color classes
const pastelColors = [
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-indigo-100",
  "bg-red-100",
  "bg-orange-100",
  "bg-teal-100",
];

const ParentEventDash = () => {
  // Provide default empty array for events in case it's undefined.
  const { events = [], loading, error } = useSelector(
    (state) => state?.Parent?.events || {}
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [eventIndex, setEventIndex] = useState(0);
  const [bgColor, setBgColor] = useState("bg-gray-200");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events.length > 0) {
      const today = moment();
      const todayEvents = events.filter((event) =>
        moment(event.date).isSame(today, "day")
      );

      if (todayEvents.length > 0) {
        handleDateClick(todayEvents[0].date);
      } else {
        const upcomingEvents = events.filter(
          (event) =>
            moment(event.date).isSameOrAfter(today, "day") &&
            moment(event.date).isSame(today, "month") &&
            moment(event.date).isSame(today, "year")
        );
        if (upcomingEvents.length > 0) {
          handleDateClick(upcomingEvents[0].date);
        }
      }
    }
  }, [events]);

  // Whenever 'selectedEvent' changes, pick a new random pastel color
  useEffect(() => {
    if (selectedEvent.length > 0) {
      const randomIndex = Math.floor(Math.random() * pastelColors.length);
      setBgColor(pastelColors[randomIndex]);
    } else {
      setBgColor("bg-gray-200");
    }
  }, [selectedEvent]);

  const eventList = events.map((event) => ({
    title: event.title,
    start: moment(event.date).toDate(),
    end: moment(event.date).toDate(),
    id: event._id,
    description: event.description,
    time: event.time,
  }));

  const eventDates = new Set(
    eventList.map((event) => moment(event.start).format("YYYY-MM-DD"))
  );

  const dayPropGetter = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    if (eventDates.has(formattedDate)) {
      return {
        className: "event-day",
        onClick: () => handleDateClick(date),
      };
    }
    return {};
  };

  // Use local state setters instead of dispatching Redux actions.
  const handleMonthChange = (direction) => {
    const newMonth = selectedMonthYear.month + direction;
    const newYear =
      newMonth > 11
        ? selectedMonthYear.year + 1
        : newMonth < 0
        ? selectedMonthYear.year - 1
        : selectedMonthYear.year;
    const adjustedMonth = newMonth > 11 ? 0 : newMonth < 0 ? 11 : newMonth;
    setSelectedMonthYear({
      month: adjustedMonth,
      year: newYear,
    });
    setSelectedEvent([]);
    setEventIndex(0);
  };

  const handleDateClick = (date) => {
    const filteredEvents = eventList.filter(
      (e) =>
        moment(e.start).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
    );
    setSelectedEvent(filteredEvents);
    setEventIndex(0);
  };

  const handleEventScroll = (direction) => {
    setEventIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return 0;
      if (newIndex >= selectedEvent.length) return prevIndex;
      return newIndex;
    });
  };

  return (
    <div className="w-full py-1">
      {/* Month Navigation */}
      <div className="flex justify-center items-center gap-8 p-4 bg-gray-100 rounded-lg mb-2">
        <button
          className="p-1 border rounded-full hover:bg-gray-700 hover:text-white"
          onClick={() => handleMonthChange(-1)}
        >
          <IoIosArrowBack />
        </button>
        <h2 className="text-sm font-semibold">
          {moment({
            year: selectedMonthYear.year,
            month: selectedMonthYear.month,
          }).format("MMMM YYYY")}
        </h2>
        <button
          className="p-1 border rounded-full hover:bg-gray-700 hover:text-white"
          onClick={() => handleMonthChange(1)}
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Calendar Component */}
      <div className="bg-white rounded-lg">
        <Calendar
          localizer={localizer}
          eventList={[]}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          selectable
          dayPropGetter={dayPropGetter}
          date={new Date(selectedMonthYear.year, selectedMonthYear.month)}
          style={{
            height: 300,
            fontSize: 12,
            border: "none",
          }}
          toolbar={false}
        />
      </div>

      {/* Display Selected Event List */}
      {selectedEvent.length > 0 ? (
        <div className="relative">
          <div className="flex">
            {selectedEvent.map(
              (event, index) =>
                index === eventIndex && (
                  <div
                    key={event.id}
                    className={`mt-2 p-3 rounded-lg flex items-center gap-2 w-full ${bgColor}`}
                  >
                    <img
                      src={announcement}
                      alt="Event"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <Tooltip title={event.title}>
                        <h3 className="text-md w-[250px] truncate font-semibold text-gray-900">
                          {event.title}
                        </h3>
                      </Tooltip>
                      <h3 className="text-xs font-semibold text-gray-600">
                        {moment(selectedEvent[0].start).format(
                          "ddd, MMM D, YYYY"
                        )}{" "}
                        ({event.time})
                      </h3>
                      <p className="text-gray-700 text-xs">
                        {event.description}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
          {selectedEvent.length > 1 && (
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between">
              <button
                className={`p-1 bg-gray-300 rounded-full ${
                  eventIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handleEventScroll(-1)}
                disabled={eventIndex === 0}
              >
                <IoIosArrowBack />
              </button>
              <button
                className={`p-1 bg-gray-300 rounded-full ${
                  eventIndex === selectedEvent.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handleEventScroll(1)}
                disabled={eventIndex === selectedEvent.length - 1}
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 p-6 text-center text-gray-500 text-sm bg-gray-100 rounded-lg">
          Click on a date to view eventList.
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
          .rbc-month-view {
            border-radius: 4px;
            background-color: #ffffff;
            padding: 10px;
            border: 1px solid #d1d5db;
          }
          .rbc-header {
            font-weight: bold;
            color: #333333;
            font-size: 12px;
            text-align: center;
          }
          .rbc-today {
            background-color: #f0f0f0 !important;
            border-radius: 4px;
          }
          .rbc-date-cell {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            position: relative;
            padding: 0 !important;
            text-align: center;
          }
          .event-day {
            position: relative;
            text-align: center;
            cursor: pointer;
          }
          .event-day::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background-color: rgb(59, 130, 246);
            border-radius: 50%;
            pointer-eventList: none;
            z-index: 1;
          }
          .event-day span {
            position: absolute;
            z-index: 2; 
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default ParentEventDash;
