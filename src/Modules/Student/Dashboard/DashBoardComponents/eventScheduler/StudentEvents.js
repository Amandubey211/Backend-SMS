import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import announcement from "../../../../../Assets/StudentAssets/announcement.png";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { stdEvent } from "../../../../../Store/Slices/Student/Noticeboard/events.action";
import {
  setSelectedEvent,
  setSelectedMonthYear,
} from "../../../../../Store/Slices/Student/Noticeboard/eventsSlice";
import { Tooltip } from "antd";

const localizer = momentLocalizer(moment);

const StudentEvents = () => {
  const { eventData, selectedEvent, selectedMonthYear } = useSelector(
    (store) => store.student.studentEvent
  );
  const [eventIndex, setEventIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stdEvent());
  }, [dispatch]);

  useEffect(() => {
    if (eventData?.length > 0) {
      const today = moment();
      const todayEvents = eventData?.filter((event) =>
        moment(event.date).isSame(today, "day")
      );

      if (todayEvents.length > 0) {
        handleDateClick(todayEvents[0].date);
      } else {
        const upcomingEvents = eventData?.filter(
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
  }, [eventData, dispatch]);

  const events = eventData?.map((event) => ({
    title: event.title,
    start: moment(event?.date).toDate(),
    end: moment(event?.date).toDate(),
    id: event._id,
    description: event?.description,
    time: event.time,
  }));

  const eventDates = new Set(
    events?.map((event) => moment(event.start).format("YYYY-MM-DD"))
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

  const handleMonthChange = (direction) => {
    const newMonth = selectedMonthYear.month + direction;
    const newYear =
      newMonth > 11
        ? selectedMonthYear.year + 1
        : newMonth < 0
        ? selectedMonthYear.year - 1
        : selectedMonthYear.year;
    const adjustedMonth = newMonth > 11 ? 0 : newMonth < 0 ? 11 : newMonth;

    dispatch(
      setSelectedMonthYear({
        month: adjustedMonth,
        year: newYear,
      })
    );
    dispatch(setSelectedEvent([]));
    setEventIndex(0);
  };

  const handleDateClick = (date) => {
    const filteredEvents = events.filter(
      (e) =>
        moment(e.start).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
    );
    dispatch(setSelectedEvent(filteredEvents));
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
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex justify-center items-center gap-8 p-4 bg-gray-100 rounded-lg mb-2">
        <button
          className="p-1 border rounded-full hover:bg-purple-500 hover:text-white"
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
          events={[]}
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

      {/* Display Selected Events */}
      {selectedEvent.length > 0 ? (
        <div className="relative">
          <div className="flex">
            {selectedEvent.map(
              (event, index) =>
                index === eventIndex && (
                  <div
                    key={event.id}
                    className={`mt-3 p-3 rounded-lg bg-purple-100 flex items-center gap-2 w-full`}
                  >
                    <img
                      src={announcement}
                      alt="Event"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <Tooltip title={event.title}>
                        <h3 className="text-md w-[250px] truncate font-semibold text-purple-700">
                          {event.title}
                        </h3>
                      </Tooltip>
                      <h3 className="text-xs font-semibold text-gray-600">
                        {moment(selectedEvent[0].start).format(
                          "ddd, MMM D, YYYY"
                        )}{" "}
                        ({event.time})
                      </h3>
                      <p className="text-gray-500 text-xs">
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
                className={`p-1 bg-gray-200 rounded-full ${
                  eventIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handleEventScroll(-1)}
                disabled={eventIndex === 0} // This can be removed, but kept for extra measure
              >
                <IoIosArrowBack />
              </button>
              <button
                className={`p-1 bg-gray-200 rounded-full ${
                  eventIndex === selectedEvent.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handleEventScroll(1)}
                disabled={eventIndex === selectedEvent.length - 1} // This can be removed, but kept for extra measure
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 p-6 text-center text-gray-500 text-sm bg-gray-100 rounded-lg">
          Click on a date to view events.
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
    .event-day {
      position: relative;
      text-align: center;
      cursor: pointer;
    }
    .rbc-month-view {
      border-radius: 10px;
      background: linear-gradient(to bottom, #ffeff1, #e3f2fd);
      padding: 10px;
    }
    .rbc-header {
      font-weight: bold;
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
      // top: 16px;
      // left: 2px;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      position: relative;
      padding:0 !important
    }
    .event-day::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background-color: rgba(128, 0, 128, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1; /* Lower z-index */
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

export default StudentEvents;
