import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout"; 
import EventCard from "./Events/subComponents/EventCard";
import Sidebar from "../../../Components/Common/Sidebar";
import ViewEvent from "./Events/subComponents/ViewEvent";
import Spinner from "../../../Components/Common/Spinner"; // Import Spinner
import { IoCalendarOutline } from "react-icons/io5"; // Import the calendar icon for empty states
import { baseUrl } from "../../../config/Common";
import { format, parseISO, isValid } from "date-fns";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";

const ParentEvent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  useNavHeading("Parent All Events");

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${baseUrl}/admin/all/events`, {
          headers: {
            Authentication: token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch events, status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success && data.events) {
          const formattedEvents = data.events.map((event, index) => ({
            ...event,
            id: index,
            startDate: parseISO(event.date),
            endDate: new Date(
              new Date(event.date).setHours(new Date(event.date).getHours() + 2)
            ),
          }));
          setEvents(formattedEvents);
          filterAndSortEvents(formattedEvents, selectedMonthYear);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents(events, selectedMonthYear);
  }, [selectedMonthYear, events]);

  const filterAndSortEvents = (events, { month, year }) => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    const sorted = filtered.sort((a, b) => a.startDate - b.startDate);

    setFilteredEvents(sorted);
    setCurrentPage(0);
  };

  const handleDateCellRender = (value) => {
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = filteredEvents.filter(
      (event) => format(event.startDate, "yyyy-MM-dd") === formattedDate
    );

    const bgColors = [
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-indigo-500",
    ];

    return (
      <ul className="events space-y-1 max-h-20 overflow-y-auto">
        {dayEvents.map((event, index) => {
          const eventTime = event.time
            ? new Date(`${format(event.startDate, "yyyy-MM-dd")}T${event.time}`)
            : event.startDate;
          const timeString = isValid(eventTime)
            ? format(eventTime, "hh:mm a")
            : "Invalid Time";

          return (
            <li
              key={event.id}
              className={`inline-block px-2 py-1 rounded text-white ${
                bgColors[index % bgColors.length]
              } shadow-md cursor-pointer`}
              onClick={() => handleStickerClick(event)}
            >
              {event.title} - {timeString}
            </li>
          );
        })}
      </ul>
    );
  };

  const handleStickerClick = (event) => {
    setSelectedEvent(event);
    setSidebarContent("viewEvent");
    setSidebarOpen(true);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return <ViewEvent event={selectedEvent} />;
      default:
        return <div>Select an action</div>;
    }
  };

  const paginatedEvents = filteredEvents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];

  return (
    <>
      <Layout title="Parent | Event">
        <ParentDashLayout>
          <div className="min-h-screen p-4 bg-gray-50">
            <div className="flex flex-row justify-between">
              <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
                 Events
              </h1>
            </div>

            <div className="my-4 w-full h-40 flex rounded-sm gap-8 pl-8 relative ">
              {currentPage > 0 && (
                <div
                  className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                >
                  <IoIosArrowBack />
                </div>
              )}
              {paginatedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                  <IoCalendarOutline className="text-6xl" />
                  <span>No Events in this Month</span>
                </div>
              ) : (
                paginatedEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    color={bgColors[index % bgColors.length]}
                    onClick={handleStickerClick}
                    className="transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                  />
                ))
              )}
              {(currentPage + 1) * itemsPerPage < filteredEvents.length && (
                <div
                  className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <IoIosArrowForward />
                </div>
              )}
            </div>

            <hr className="my-6 border-t-2 mt-12 " />
            <div className="py-7">
              <Calendar
                dateCellRender={handleDateCellRender}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const start = 0;
                  const end = 12;
                  const monthOptions = [];

                  const localeData = value.localeData();
                  const months = localeData.monthsShort();

                  for (let index = start; index < end; index++) {
                    monthOptions.push(
                      <option key={index} value={index}>
                        {months[index]}
                      </option>
                    );
                  }

                  const year = value.year();
                  const month = value.month();
                  const options = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    options.push(
                      <option className="bg-white" key={i} value={i}>
                        {i}
                      </option>
                    );
                  }
                  return (
                    <div className="flex items-center space-x-2 justify-end mt-2 pt-2 mb-4">
                      <select
                        className="border rounded px-2 py-1"
                        value={year}
                        onChange={(event) => {
                          const newYear = parseInt(event.target.value, 10);
                          const now = value.clone().year(newYear);
                          setSelectedMonthYear((prev) => ({
                            ...prev,
                            year: newYear,
                          }));
                          onChange(now);
                        }}
                      >
                        {options}
                      </select>
                      <select
                        className="border rounded px-2 py-1"
                        value={month}
                        onChange={(event) => {
                          const newMonth = parseInt(event.target.value, 10);
                          const now = value.clone().month(newMonth);
                          setSelectedMonthYear((prev) => ({
                            ...prev,
                            month: newMonth,
                          }));
                          onChange(now);
                        }}
                      >
                        {monthOptions}
                      </select>
                      <div className="flex space-x-2">
                        <button
                          className={`border rounded px-2 py-1 ${
                            type === "month"
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                              : ""
                          }`}
                          onClick={() => onTypeChange("month")}
                        >
                          Month
                        </button>
                        <button
                          className={`border rounded px-2 py-1 ${
                            type === "year"
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                              : ""
                          }`}
                          onClick={() => onTypeChange("year")}
                        >
                          Year
                        </button>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
              title="View Event"
              event={selectedEvent}
            >
              {renderSidebarContent()}
            </Sidebar>
          </div>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default ParentEvent;
