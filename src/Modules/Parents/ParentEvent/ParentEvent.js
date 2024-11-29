import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";
import EventCard from "./Events/subComponents/EventCard";
import Sidebar from "../../../Components/Common/Sidebar";
import ViewEvent from "./Events/subComponents/ViewEvent";
import Spinner from "../../../Components/Common/Spinner";
import { IoCalendarOutline } from "react-icons/io5";
import { format, parseISO, parse, isValid } from "date-fns";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../../Store/Slices/Parent/Events/event.action.js";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ParentEvent = () => {
  const { t } = useTranslation('prtEvents'); // Initialize translation hook
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state?.Parent?.events || {}); // Optional chaining for safety
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  useNavHeading(t("Parent All Events"));

  const itemsPerPage = 4;

  // Fetch events using Redux on component mount
  useEffect(() => {
    dispatch(fetchAllEvents()); // Dispatch the Redux thunk to fetch events
  }, [dispatch]);

  // Ensure all event dates are properly parsed and formatted
  useEffect(() => {
    if (events?.length > 0) {
      const formattedEvents = events?.map((event) => ({
        ...event,
        startDate: parseISO(event?.date), // Parse the ISO string from API
        endDate: new Date(
          new Date(event?.date).setHours(new Date(event?.date).getHours() + 2)
        ), // Add 2 hours for endDate (adjust as needed)
      }));

      filterAndSortEvents(formattedEvents, selectedMonthYear);
    }
  }, [selectedMonthYear, events]);

  const filterAndSortEvents = (events, { month, year }) => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event?.startDate);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    const sorted = filtered.sort((a, b) => a.startDate - b.startDate);
    setFilteredEvents(sorted);
    setCurrentPage(0);
  };

const handleDateCellRender = (value) => {
  const formattedDate = format(value.toDate(), 'yyyy-MM-dd');
  const dayEvents = filteredEvents.filter(
    (event) => format(event?.startDate, 'yyyy-MM-dd') === formattedDate
  );

  const bgColors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-indigo-500'];

  return (
    <ul className="events space-y-1 max-h-20 overflow-y-auto">
      {dayEvents?.map((event, index) => {
        // Parse time from event, support both 24-hour and 12-hour formats
        let eventTime = event?.time
          ? parse(event?.time, 'hh:mm a', new Date()) // Try parsing as 12-hour format first
          : event?.startDate;

        if (!isValid(eventTime)) {
          eventTime = parse(event?.time, 'HH:mm', new Date()); // Fallback for 24-hour format
        }

        const timeString = isValid(eventTime)
          ? format(eventTime, 'hh:mm a')  // Always display in 12-hour format
          : 'Invalid Time';

        return (
          <li
            key={event?.id}
            className={`inline-block px-2 py-1 rounded text-white ${
              bgColors[index % bgColors.length]
            } shadow-md cursor-pointer`}
            onClick={() => handleStickerClick(event)}
          >
            {event?.title} - {timeString}
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
  
    // Apply inline styles to the <nav> to dim it
    const nav = document.querySelector("nav");
    if (nav) {
      nav.style.zIndex = "-1";   // Lower the z-index
      nav.style.transition = "opacity 0.3s ease"; // Smooth transition effect
    }
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  
    // Remove inline styles from the <nav> when closing the sidebar
    const nav = document.querySelector("nav");
    if (nav) {
      nav.style.zIndex = "";  // Reset z-index to default
      nav.style.transition = ""; // Reset transition to default
    }
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
            {/* Display loading spinner, error, or no events */}
            {loading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-4">
                <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
                <p className="text-gray-600 font-semibold">{error}: {t("Unable to fetch events")}</p>
              </div>
            ) : paginatedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4">
                <IoCalendarOutline className="text-6xl" />
                <span>No Events in this Month</span>
              </div>
            ) : (
              <>
                {/* Events display */}
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
                  {paginatedEvents?.map((event, index) => (
                    <EventCard
                      key={event?.id}
                      event={event}
                      color={bgColors[index % bgColors.length]}
                      onClick={handleStickerClick}
                      className="transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                    />
                  ))}
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
              </>
            )}

            {/* Calendar always visible */}
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
                    </div>
                  );
                }}
              />
            </div>

            <Sidebar
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
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
