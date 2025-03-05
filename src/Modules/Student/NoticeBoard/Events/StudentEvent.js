import React, { useEffect, useState } from "react";
import { Calendar } from "antd";
import "../Events/customCalendar.css";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import { format, parse, isValid } from "date-fns";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { stdEvent } from "../../../../Store/Slices/Student/Noticeboard/events.action";
import {
  setFilteredEvents,
  setSelectedEvent,
  setSidebarContent,
  setSidebarOpen,
} from "../../../../Store/Slices/Student/Noticeboard/eventsSlice";
import ViewEvent from "./ViewEvent";
import EventCard from "./EventCard";
import Sidebar from "./Sidebar";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";
import OfflineModal from "../../../../Components/Common/Offline";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import Spinner from "../../../../Components/Common/Spinner";
import NoEventFound from "../../../../Assets/StudentAssets/no-event-found.avif";

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

  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];

  useNavHeading("Event");

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  useEffect(() => {
    dispatch(stdEvent());
  }, [dispatch]);

  useEffect(() => {
    filterAndSortEvents(eventData, selectedMonthYear);
  }, [selectedMonthYear, eventData]);

  const filterAndSortEvents = (eventData, selectedMonthYear) => {
    const filtered = eventData?.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getMonth() === selectedMonthYear?.month &&
        eventDate?.getFullYear() === selectedMonthYear.year
      );
    });

    const sorted = filtered?.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
    dispatch(setFilteredEvents(sorted));
    setCurrentIndex(0); // Reset currentIndex when month changes
  };

  const handleDateCellRender = (value) => {
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = filteredEvents?.filter(
      (event) => format(event?.startDate, "yyyy-MM-dd") === formattedDate
    );

    return (
      <ul className="events space-y-1 max-h-20 overflow-y-auto">
        {dayEvents?.map((event, index) => {
          let eventTime = event?.time
            ? parse(event?.time, "hh:mm a", new Date())
            : event?.startDate;

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
    dispatch(setSelectedEvent(event));
    dispatch(setSidebarContent("viewEvent"));
    dispatch(setSidebarOpen(true));
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return <ViewEvent event={selectedEvent} />;
      default:
        return <div>{t("Select an action", gt.stdEvents)}</div>;
    }
  };

  const handleSidebarView = () => {
    dispatch(setSidebarOpen(false));
  };

  const paginatedEvents = filteredEvents.slice(currentIndex, currentIndex + 4); // Use filteredEvents

  const handlePrev = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex((prev) => prev - 4);
    }
  };

  const handleNext = () => {
    if (currentIndex + 4 < filteredEvents.length) {
      // Use filteredEvents length
      setCurrentIndex((prev) => prev + 4);
    }
  };

  return (
    <>
      <Layout title="Events">
        <StudentDashLayout>
          <div className="min-h-screen p-4 bg-gray-50 w-full">
            <div className="my-4 w-full h-auto flex items-baseline relative">
              {currentIndex > 0 && (
                <button
                  className="p-1 border rounded-full hover:bg-gray-700 hover:text-white absolute left-[-10px] top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-100 shadow-md transition-all z-10"
                  onClick={handlePrev}
                >
                  <IoIosArrowBack size={20} />
                </button>
              )}
              {loading && !error ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 ">
                  <Spinner />
                </div>
              ) : paginatedEvents?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {paginatedEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      color={bgColors[index % bgColors.length]}
                      onClick={handleStickerClick}
                      className="transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                  <img
                    src={NoEventFound}
                    className="h-[200px] w-[300px]"
                    alt="event"
                  ></img>
                  {/* <IoCalendarOutline className="text-6xl" /> */}
                  <span>{t("No Events in this Month", gt.stdEvents)}</span>
                </div>
              )}

              {currentIndex + 4 < filteredEvents.length && (
                <button
                  className="p-1 border rounded-full hover:bg-gray-700 hover:text-white absolute right-[-10px] top-1/2 transform -translate-y-1/2 p text-gray-500 bg-gray-100 shadow-md transition-all z-10"
                  onClick={handleNext}
                >
                  <IoIosArrowForward size={20} />
                </button>
              )}
            </div>

            <hr className="border-t-1 mt-12" />
            <div className="w-full px-2">
              <Calendar
                dateCellRender={handleDateCellRender}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const StartAcademicYear = 2015;
                  const lastAcademicYear = 2050;

                  const start = 0;
                  const end = 12;
                  const monthOptions = [];

                  const localeData = value.localeData();
                  const months = localeData.monthsShort();

                  for (let index = start; index < end; index++) {
                    monthOptions.push(
                      <option key={index} value={index}>
                        {t(months[index], gt.month)}
                      </option>
                    );
                  }

                  const year = value.year();
                  const month = value.month();
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
                        className="border rounded  bg-pink-100  px-3 py-2 text-pink-800 font-medium  "
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
