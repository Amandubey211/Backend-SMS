import React, { useEffect, useState } from "react";
import { Calendar } from "antd";
import { format, parse, isValid } from "date-fns";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import ViewEvent from "./ViewEvent";
import EventCard from "./EventCard";
import Sidebar from "./Sidebar";
import OfflineModal from "../../../../Components/Common/Offline";
import Spinner from "../../../../Components/Common/Spinner";
import NoEventFound from "../../../../Assets/StudentAssets/no-event-found.avif";

import { stdEvent } from "../../../../Store/Slices/Student/Noticeboard/events.action";
import {
  setFilteredEvents,
  setSelectedEvent,
  setSidebarContent,
  setSidebarOpen,
} from "../../../../Store/Slices/Student/Noticeboard/eventsSlice";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import { gt } from "../../../../Utils/translator/translation";
import "../Events/customCalendar.css";
import { EventCardSkeleton } from "../../../Parents/Skeletons";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { IoCalendarOutline } from "react-icons/io5";

const StudentEvent = () => {
  const {
    eventData,
    filteredEvents,
    selectedEvent,
    sidebarContent,
    isSidebarOpen,
    currentDate,
    loading,
    error,
  } = useSelector((store) => store.student.studentEvent);
  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Set the initial selected month and year using currentDate
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  // Single state variable for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  // Define colors for rendering events on the calendar date cells
  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];

  // Set the navigation heading
  useNavHeading("Event");

  // Function to dismiss error alerts
  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(stdEvent());
  }, [dispatch]);

  // Filter and sort events whenever the selected month/year or event data changes
  useEffect(() => {
    filterAndSortEvents(eventData, selectedMonthYear);
    setCurrentPage(0); // Reset pagination when filtering events
  }, [selectedMonthYear, eventData]);

  const filterAndSortEvents = (eventData, selectedMonthYear) => {
    const filtered = eventData?.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getMonth() === selectedMonthYear.month &&
        eventDate.getFullYear() === selectedMonthYear.year
      );
    });

    const sorted = filtered?.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    dispatch(setFilteredEvents(sorted));
  };

  // Render events on calendar date cells
  const handleDateCellRender = (value) => {
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = filteredEvents?.filter(
      (event) =>
        format(new Date(event?.startDate), "yyyy-MM-dd") === formattedDate
    );

    return (
      <ul className="events space-y-1 max-h-20 overflow-y-auto">
        {dayEvents?.map((event, index) => {
          let eventTime = event?.time
            ? parse(event?.time, "hh:mm a", new Date())
            : new Date(event?.startDate);

          if (!isValid(eventTime)) {
            eventTime = parse(event?.time, "HH:mm", new Date());
          }

          const timeString = isValid(eventTime)
            ? format(eventTime, "hh:mm a")
            : "Invalid Time";

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

  // Handle clicking on an event card or calendar item
  const handleStickerClick = (event) => {
    dispatch(setSelectedEvent(event));
    dispatch(setSidebarContent("viewEvent"));
    dispatch(setSidebarOpen(true));
  };

  // Render the sidebar content based on the selected action
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return <ViewEvent event={selectedEvent} />;
      default:
        return <div>{t("Select an action", gt.stdEvents)}</div>;
    }
  };

  // Close the sidebar view
  const handleSidebarView = () => {
    dispatch(setSidebarOpen(false));
  };

  // Get paginated events based on currentPage
  const paginatedEvents = filteredEvents?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Handle pagination navigation
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <Layout title="Events">
        <StudentDashLayout>
          <div className="min-h-screen p-4 bg-gray-50 w-full">
            {/* Events display */}
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
              <div className="relative flex items-center justify-center">
                <button
                  className={`absolute left-0 z-10 p-3 bg-white shadow-lg rounded-full transition-transform duration-200 hover:scale-110 ${
                    currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                >
                  <IoIosArrowBack size={24} className="text-purple-500" />
                </button>

                <div className="flex gap-6 overflow-x-auto px-6 py-1 scrollbar-hide justify-start w-full">
                  {paginatedEvents?.map((event, index) => (
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
                  onClick={handleNext}
                  disabled={currentPage + 1 >= totalPages}
                >
                  <IoIosArrowForward size={24} className="text-purple-500" />
                </button>
              </div>
            )
             // <hr className="border-t-1 mt-12" />
            }
           
            {/* Calendar display */}
            <div className="w-full px-2">
              <Calendar
                dateCellRender={handleDateCellRender}
                headerRender={({ value, onChange }) => {
                  const StartAcademicYear = 2015;
                  const lastAcademicYear = 2050;
                  const monthOptions = [];
                  const localeData = value.localeData();
                  const months = localeData.monthsShort();

                  for (let index = 0; index < 12; index++) {
                    monthOptions.push(
                      <option key={index} value={index}>
                        {t(months[index], gt.month)}
                      </option>
                    );
                  }

                  const year = value.year();
                  const options = [];
                  for (let i = StartAcademicYear; i <= lastAcademicYear; i++) {
                    options.push(
                      <option className="bg-white" key={i} value={i}>
                        {t(i, gt.date)}
                      </option>
                    );
                  }
                  return (
                    <div className="flex items-center space-x-2 justify-end mt-2 pt-2 mb-4">
                      <select
                        className="border rounded bg-pink-100 px-3 py-2 text-pink-800 font-medium"
                        value={value.month()}
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
                        className="border bg-pink-100 rounded px-3 py-2 text-pink-800 font-medium"
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
            {/* Sidebar for event details */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarView}
              title="View Event"
              event={selectedEvent}
            >
              {renderSidebarContent()}
            </Sidebar>
          </div>

          {!loading && showError && (
            <OfflineModal error={error} onDismiss={handleDismiss} />
          )}
        </StudentDashLayout>
      </Layout>
    </>
  );
};

export default StudentEvent;
