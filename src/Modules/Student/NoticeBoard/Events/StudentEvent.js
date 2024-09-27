import React, { useEffect, useState } from "react";
import { Calendar } from "antd";
import "../Events/customCalendar.css";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import { format, parseISO, isValid } from "date-fns";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { stdEvent } from "../../../../Store/Slices/Student/Noticeboard/events.action";
import {
  setCurrentPage,
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

const StudentEvent = () => {
  const {
    eventData,
    filteredEvents,
    currentPage,
    selectedEvent,
    sidebarContent,
    isSidebarOpen,
    itemsPerPage,
    currentDate,
  } = useSelector((store) => store.student.studentEvent);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  console.log("I am in inside1 :", eventData);

  console.log("I am in inside :", filteredEvents);
  // card colour
  const bgColors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-indigo-500",
  ];

  useNavHeading("Event");

  useEffect(() => {
    dispatch(stdEvent());
  }, [dispatch]);

  useEffect(() => {
    filterAndSortEvents(eventData, selectedMonthYear);
  }, [selectedMonthYear, eventData]);

  const filterAndSortEvents = (eventData, selectedMonthYear) => {
    const filtered = eventData.filter((event) => {
      const eventDate = new Date(event.startDate);
      console.log("event date is: ", eventDate);
      return (
        eventDate.getMonth() === selectedMonthYear?.month &&
        eventDate?.getFullYear() === selectedMonthYear.year
      );
    });

    const sorted = filtered.sort((a, b) => a.startDate - b.startDate);
    console.log("sorted event :", sorted);
    dispatch(setFilteredEvents(sorted));
    dispatch(setCurrentPage(0));
  };

  // calender function
  const handleDateCellRender = (value) => {
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = filteredEvents?.filter(
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
              className={`inline-block px-2 py-1 rounded text-white ${bgColors[index % bgColors.length]
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

  // event card function
  const handleStickerClick = (event) => {
    dispatch(setSelectedEvent(event));
    dispatch(setSidebarContent("viewEvent"));
    dispatch(setSidebarOpen(true));
  };

  // View event function
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return <ViewEvent event={selectedEvent} />;
      default:
        return <div>{t("Select an action", gt.stdEvents)}</div>;
    }
  };

  // sidebar function
  const handleSidebarView = () => {
    dispatch(setSidebarOpen(false));
  };

  // pagination
  const paginatedEvents = filteredEvents?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  console.log("pagination event is :", paginatedEvents);
  const handlePagination = () => {
    dispatch(setCurrentPage((prev) => Math.max(prev - 1, 0)));
  };

  const handleFilterPage = () => {
    dispatch(setCurrentPage((prev) => prev + 1));
  };

  // selected Month and Year

  return (
    <>
      <Layout title="Event">
        <StudentDashLayout>
          <div className="min-h-screen p-4 bg-gray-50">
            <div className="flex flex-row justify-between">
              <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
                {t("Student Events", gt.stdEvents)}
              </h1>
            </div>

            <div className="my-4 w-full h-40 flex rounded-sm gap-8 pl-8 relative ">
              {currentPage > 0 && (
                <div
                  className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2"
                  onClick={handlePagination}
                >
                  <IoIosArrowBack />
                </div>
              )}
              {paginatedEvents?.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                  <IoCalendarOutline className="text-6xl" />
                  <span>{t("No Events in this Month", gt.stdEvents)}</span>
                </div>
              ) : (
                paginatedEvents?.map((event, index) => (
                  <EventCard
                    key={event?.id}
                    event={event}
                    color={bgColors[index % bgColors?.length]}
                    onClick={handleStickerClick}
                    className="transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                  />
                ))
              )}
              {(currentPage + 1) * itemsPerPage < filteredEvents?.length && (
                <div
                  className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2"
                  onClick={handleFilterPage}
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
                      {/* <div className="flex space-x-2">
                        <button
                          className={`border rounded px-2 py-1 ${
                            type === "month"
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                              : ""
                          }`}
                          onClick={() => onTypeChange("month")}
                        >
                          {t("Month", gt.month)}
                        </button>
                        <button
                          className={`border rounded px-2 py-1 ${
                            type === "year"
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                              : ""
                          }`}
                          onClick={() => onTypeChange("year")}
                        >
                          {t("Year", gt.month)}
                        </button>
                      </div> */}
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
        </StudentDashLayout>
      </Layout>
    </>
  );
};

export default StudentEvent;
