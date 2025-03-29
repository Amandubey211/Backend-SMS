import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";
import EventCard from "./Events/subComponents/EventCard";
import Sidebar from "../../../Components/Common/Sidebar";
import ViewEvent from "./Events/subComponents/ViewEvent";
// import Spinner from "../../../Components/Common/Spinner"; // We'll replace this with a skeleton
import { IoCalendarOutline } from "react-icons/io5";
import { format, parseISO, parse, isValid } from "date-fns";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../../Store/Slices/Parent/Events/event.action.js";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { EventCardSkeleton } from "../../../Modules/Parents/Skeletons.js";

const ParentEvent = () => {
  const { t } = useTranslation("prtEvents"); // Initialize translation hook
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector(
    (state) => state?.Parent?.events
  );
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

  useNavHeading(t("Events"));

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  // Fetch events using Redux on component mount
  useEffect(() => {
    dispatch(fetchAllEvents());
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
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = filteredEvents.filter(
      (event) => format(event?.startDate, "yyyy-MM-dd") === formattedDate
    );

    const bgColors = [
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-indigo-500",
    ];

    return (
      <ul className="events space-y-1 max-h-20 overflow-y-auto">
        {dayEvents?.map((event, index) => {
          let eventTime = event?.time
            ? parse(event?.time, "hh:mm a", new Date())
            : event?.startDate;
          if (!isValid(eventTime)) {
            eventTime = parse(event?.time, "HH:mm", new Date()); // 24-hour fallback
          }
          const timeString = isValid(eventTime)
            ? format(eventTime, "hh:mm a")
            : "Invalid Time";

          return (
            <li
              key={event?.id}
              className={`inline-block px-2 py-1 rounded text-white ${
                bgColors[index % bgColors?.length]
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

    // Dim the <nav>
    const nav = document.querySelector("nav");
    if (nav) {
      nav.style.zIndex = "-1";
      nav.style.transition = "opacity 0.3s ease";
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);

    // Restore the <nav>
    const nav = document.querySelector("nav");
    if (nav) {
      nav.style.zIndex = "";
      nav.style.transition = "";
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

  const paginatedEvents = filteredEvents?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];

  const selectedAcademicYear=2025;

  return (
    <Layout title="Parents | Event">
      <ParentDashLayout>
        <div className="min-h-screen p-4 bg-gray-50">
          {loading ? (
            // 2. NEW: Use our skeleton for each event card
            <div>
              <div className="flex flex-row justify-between">
                <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
                  {t("Events")}
                </h1>
              </div>
              {/* Skeleton block simulating event cards */}
              <EventCardSkeleton count={paginatedEvents.length} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-4">
              <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
              <p className="text-gray-600 font-semibold">
                {error}: {t("Unable to fetch events")}
              </p>
            </div>
          ) : paginatedEvents?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <IoCalendarOutline className="text-6xl" />
              <span className="py-5">No Events in this Month</span>
            </div>
          ) : (
            <>
              {/* Events display */}

              <div className="relative flex items-center justify-center">
                <button
                  className={`absolute left-0 z-10 p-3 bg-white shadow-lg rounded-full transition-transform duration-200 hover:scale-110 ${
                    currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                >
                  <IoIosArrowBack size={24} className="text-purple-500" />
                </button>

                <div className="flex gap-6 overflow-x-auto px-6 py-1 scrollbar-hide justify-start w-full">
                  {paginatedEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      color={bgColors[index % bgColors.length]}
                      onClick={() => handleStickerClick(event)}
                      className="min-w-72 transform transition duration-300 ease-in-out hover:scale-110 hover:shadow-2xl rounded-lg"
                    />
                  ))}
                </div>

                <button
                  className={`absolute right-0 z-10 p-3 bg-white shadow-lg rounded-full transition-transform duration-200 hover:scale-110 ${
                    currentPage + 1 >= totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage + 1 >= totalPages}
                >
                  <IoIosArrowForward size={24} className="text-purple-500" />
                </button>
              </div>

              {/* <hr className="my-6 border-t-2 mt-12 " /> */}
            </>
          )}

          {/* Calendar always visible */}
          <div className="py-3">
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

                const year = selectedAcademicYear;
                const month = value.month();
                const options = [];
                for (let i = year; i <= year; i += 1) {
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
  );
};

export default ParentEvent;
