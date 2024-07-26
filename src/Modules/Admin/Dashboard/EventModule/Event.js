import React, { useEffect, useState, useCallback } from "react";
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import useGetFilteredEvents from "../../../../Hooks/AuthHooks/Staff/Admin/Dashboard/useGetFilteredEvents";
import Spinner from "../../../../Components/Common/Spinner";
import EventItem from "./EventItem";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Events = () => {
  const { error, events, fetchFilteredEvents, loading } = useGetFilteredEvents();
  console.log(useGetFilteredEvents)

  const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
  const currentYear = new Date().getFullYear();

  const [date, setDate] = useState({ month: currentMonth, year: currentYear });

  const fetchEvents = useCallback(() => {
    fetchFilteredEvents(date.month, date.year);
  }, [date, fetchFilteredEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleMonthChange = (e) => {
    setDate((prevDate) => ({
      ...prevDate,
      month: parseInt(e.target.value)
    }));
  };

  const handleYearChange = (e) => {
    setDate((prevDate) => ({
      ...prevDate,
      year: parseInt(e.target.value)
    }));
  };

  const handlePreviousMonth = () => {
    setDate((prevDate) => {
      const newMonth = prevDate.month === 1 ? 12 : prevDate.month - 1;
      const newYear = prevDate.month === 1 ? prevDate.year - 1 : prevDate.year;
      return { month: newMonth, year: newYear };
    });
  };

  const handleNextMonth = () => {
    setDate((prevDate) => {
      const newMonth = prevDate.month === 12 ? 1 : prevDate.month + 1;
      const newYear = prevDate.month === 12 ? prevDate.year + 1 : prevDate.year;
      return { month: newMonth, year: newYear };
    });
  };

  return (
    <div className="max-w-4xl me-1 text-gray-600 mx-auto bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Event</h2>
        <div className="flex flex-grow justify-center items-center gap-3">
          <button className="p-1 border rounded-full" onClick={handlePreviousMonth}>
            <IoIosArrowBack />
          </button>
          <h3 className="text-lg font-medium">
            {monthNames[date.month - 1]} {date.year}
          </h3>
          <button className="p-1 border rounded-full" onClick={handleNextMonth}>
            <IoIosArrowForward />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={date.month}
              onChange={handleMonthChange}
            >
              {monthNames.map((name, index) => (
                <option key={index} value={index + 1}>{name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <IoIosArrowDown />
            </div>
          </div>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={date.year}
              onChange={handleYearChange}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              {/* Add more years as needed */}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <IoIosArrowDown />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between p-2 border-y py-3 font-semibold">
        <h1>Event Name</h1>
        <h1>Event Type</h1>
        <h1>Start Date</h1>
      </div>
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="flex justify-center items-center my-10">
            <Spinner />
          </div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-10">
            <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500 text-xl">No events found</p>
          </div>
        ) : (
          events.map((event) => (
            <EventItem
              key={event.id}
              image={event.image}
              eventName={event.eventName}
              eventType={event.eventType}
              startDate={event.startDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
