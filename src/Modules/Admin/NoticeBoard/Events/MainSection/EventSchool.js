import React, { useState, useEffect, useMemo } from "react";
import { Calendar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createEventThunk,
  updateEventThunk,
  deleteEventThunk,
  fetchEventsThunk,
} from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventThunks";
import {
  setSelectedEvent,
  resetSelectedEvent,
  setSidebarContent,
  resetSidebarContent,
} from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventSlice";
import { format, isValid, parse, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import EventCard from "../subComponents/EventCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddEvent from "../subComponents/AddEvent";
import UpdateEvent from "../subComponents/UpdateEvent";
import ViewEvent from "../subComponents/ViewEvent";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";

const EventScheduler = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const dispatch = useDispatch();
  const { events, selectedEvent, sidebarContent } = useSelector(
    (state) => state.admin.events
  );
  const role = useSelector((state) => state.common.auth.role);
  const { t } = useTranslation("admEvent"); // Hook for translation

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  // Helper function to parse time strings
  const parseTime = (timeStr) => {
    const formats = ["h:mm a", "H:mm"];
    for (let formatStr of formats) {
      const parsed = parse(timeStr, formatStr, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    }
    return null;
  };

  // Helper function to parse date and time into a single Date object
  const parseDateTime = (dateStr, timeStr) => {
    const date = parseISO(dateStr);
    if (!isValid(date)) return null;

    const time = parseTime(timeStr || "00:00");
    if (!isValid(time)) return null;

    // Set hours and minutes to the date object
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return date;
  };

  // Step 1: Sort the events by date and time in descending order
  const sortedEvents = useMemo(() => {
    if (!events) return [];

    return [...events].sort((a, b) => {
      const dateTimeA = parseDateTime(a.date, a.time);
      const dateTimeB = parseDateTime(b.date, b.time);

      if (!dateTimeA && !dateTimeB) return 0;
      if (!dateTimeA) return 1; // Invalid dates go to the end
      if (!dateTimeB) return -1;

      return dateTimeB - dateTimeA; // Descending order
    });
  }, [events]);

  // Step 2: Paginate the sorted events
  const filteredEvents = useMemo(() => {
    return sortedEvents.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [sortedEvents, currentPage, itemsPerPage]);

  const handleSidebarClose = () => {
    dispatch(resetSelectedEvent());
    dispatch(resetSidebarContent());
  };

  useNavHeading(t("Noticeboard"), t("Events"));

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        await dispatch(updateEventThunk(eventData));
        toast.success(t("Event updated successfully!"));
      } else {
        await dispatch(createEventThunk(eventData));
        toast.success(t("Event created successfully!"));
      }

      handleSidebarClose();
      dispatch(fetchEventsThunk());
    } catch (error) {
      toast.error(t("Failed to save event"));
    }
  };

  const handleEventClick = (event) => {
    dispatch(setSelectedEvent(event));
    dispatch(setSidebarContent("viewEvent"));
  };

  // Predefined background colors for events
  const bgColors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-yellow-200",
  ];

  // Custom date cell render for the calendar
  const handleDateCellRender = (value) => {
    if (events?.length > 0) {
      // Format the date for comparison
      const formattedDate = format(value?.toDate(), "yyyy-MM-dd");

      // Filter events to match the formatted date
      const dayEvents = events?.filter((event) => {
        const eventDate = event?.date ? parseISO(event.date) : null;
        return (
          isValid(eventDate) &&
          format(eventDate, "yyyy-MM-dd") === formattedDate
        );
      });

      const cellBgColors = [
        "bg-pink-500",
        "bg-purple-500",
        "bg-blue-500",
        "bg-indigo-500",
      ];

      return (
        <ul className="events space-y-1 max-h-20 overflow-y-auto">
          {dayEvents?.map((event, index) => (
            <li
              key={event?._id}
              className={`inline-block px-2 py-1 rounded text-white ${cellBgColors[index % cellBgColors.length]
                } shadow-md cursor-pointer`}
              onClick={() => handleEventClick(event)}
            >
              {event?.title} - {event?.time || "-"}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const sidebarTitle =
    sidebarContent === "viewEvent" && selectedEvent
      ? selectedEvent.title
      : sidebarContent === "addEvent"
        ? t("Add New Event")
        : sidebarContent === "updateEvent"
          ? t("Update Event")
          : t("Sidebar");

  return (
    <Layout title={`${t("Event")} | ${t("Student Diwan")}`}>
      <DashLayout>
        <ProtectedSection
          requiredPermission={PERMISSIONS.SHOW_EVENTS}
          title={"Events"}
        >
          <div className="min-h-screen p-4 bg-gray-50 max-w-screen">
            <div className="flex flex-row justify-between">
              <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
                {t("")}
              </h1>
              <ProtectedAction requiredPermission={PERMISSIONS.ADD_NEW_EVENT}>
                {!["parent", "studnt"].includes(role) && (
                  <button
                    className="h-10 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                    onClick={() => dispatch(setSidebarContent("addEvent"))}
                  >
                    {t("Add New Event")}
                  </button>
                )}
              </ProtectedAction>
            </div>

            {/* Event Cards Pagination */}
            {/* Event Cards Pagination */}
            <div className="my-4 h-40 flex justify-center items-center rounded-sm gap-8 px-8 relative">
              {currentPage > 0 && (
                <div
                  className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                >
                  <IoIosArrowBack />
                </div>
              )}

              {filteredEvents?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 w-full">
                  <IoCalendarOutline className="text-6xl" />
                  <span>{t("No Events in this Month")}</span>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-8 w-full max-w-5xl mx-auto mt-8">
                  {filteredEvents?.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              )}

              {(currentPage + 1) * itemsPerPage < sortedEvents.length && (
                <div
                  className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <IoIosArrowForward />
                </div>
              )}
            </div>

            {/* Add HR and margin bottom */}
            <hr className="my-6 border-t-2 mt-12" />

            {/* Calendar Date Render */}
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
                const yearOptions = [];
                for (let i = year - 10; i < year + 10; i++) {
                  yearOptions.push(
                    <option key={i} value={i}>
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
                        onChange(now);
                      }}
                    >
                      {yearOptions}
                    </select>
                    <select
                      className="border rounded px-2 py-1"
                      value={month}
                      onChange={(event) => {
                        const newMonth = parseInt(event.target.value, 10);
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {monthOptions}
                    </select>
                    <div className="flex space-x-2">
                      <button
                        className={`border rounded px-2 py-1 ${type === "month"
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                            : ""
                          }`}
                        onClick={() => onTypeChange("month")}
                      >
                        {t("Month")}
                      </button>
                      <button
                        className={`border rounded px-2 py-1 ${type === "year"
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                            : ""
                          }`}
                        onClick={() => onTypeChange("year")}
                      >
                        {t("Year")}
                      </button>
                    </div>
                  </div>
                );
              }}
              className="custom-calendar"
            />

            {/* Sidebar for Event Actions */}
            <Sidebar
              title={sidebarTitle}
              isOpen={!!sidebarContent}
              onClose={handleSidebarClose}
            >
              {sidebarContent === "viewEvent" && selectedEvent ? (
                <ViewEvent />
              ) : sidebarContent === "viewEvent" ? (
                <p>{t("No event selected")}</p>
              ) : null}

              {sidebarContent === "addEvent" && (
                <AddEvent onSave={handleSaveEvent} />
              )}

              {sidebarContent === "updateEvent" && (
                <UpdateEvent onSave={handleSaveEvent} />
              )}
            </Sidebar>
          </div>
        </ProtectedSection>
      </DashLayout>
    </Layout>
  );
};

export default EventScheduler;
