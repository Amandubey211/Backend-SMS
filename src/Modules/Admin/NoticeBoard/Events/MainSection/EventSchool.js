import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Select, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createEventThunk,
  updateEventThunk,
  fetchEventsThunk,
} from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventThunks";
import {
  setSelectedEvent,
  resetSelectedEvent,
  setSidebarContent,
  resetSidebarContent,
} from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventSlice";
import { format, isValid, parseISO, getYear, getMonth } from "date-fns";
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
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../config/permission";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const { Option } = Select;

// Rainbow gradients
const eventColors = [
  "bg-gradient-to-r from-red-400 to-orange-400",
  "bg-gradient-to-r from-orange-400 to-yellow-400",
  "bg-gradient-to-r from-yellow-400 to-green-400",
  "bg-gradient-to-r from-green-400 to-blue-400",
  "bg-gradient-to-r from-blue-400 to-indigo-400",
  "bg-gradient-to-r from-indigo-400 to-purple-400",
  "bg-gradient-to-r from-purple-400 to-pink-400",
];

const eventBadgeColors = [
  "bg-gradient-to-r from-red-600 to-orange-600",
  "bg-gradient-to-r from-orange-600 to-yellow-600",
  "bg-gradient-to-r from-yellow-600 to-green-600",
  "bg-gradient-to-r from-green-600 to-blue-600",
  "bg-gradient-to-r from-blue-600 to-indigo-600",
  "bg-gradient-to-r from-indigo-600 to-purple-600",
  "bg-gradient-to-r from-purple-600 to-pink-600",
];

const getColorIndex = (id) => {
  if (!id) return 0;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash &= hash;
  }
  return Math.abs(hash) % eventColors.length;
};

const EventScheduler = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const dispatch = useDispatch();
  const {
    events = [],
    selectedEvent,
    sidebarContent,
    loading,
  } = useSelector((state) => state.admin.events || {});
  const role = useSelector((state) => state.common.auth.role);
  const { t } = useTranslation("admEvent");

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  // Sort events descending by date+time
  const sortedEvents = useMemo(() => {
    return [...events]
      .map((e) => {
        const dt = e.date ? parseISO(e.date) : null;
        return { ...e, _parsed: isValid(dt) ? dt : new Date(0) };
      })
      .sort((a, b) => b._parsed - a._parsed);
  }, [events]);

  const pagedEvents = useMemo(
    () =>
      sortedEvents.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      ),
    [sortedEvents, currentPage]
  );

  const handleSidebarClose = () => {
    dispatch(resetSelectedEvent());
    dispatch(resetSidebarContent());
  };

  useNavHeading(t("Noticeboard"), t("Events"));

  const handleSaveEvent = async (data) => {
    try {
      if (selectedEvent) {
        const response = await dispatch(updateEventThunk(data));
        if (response.payload.success) {

          toast.success(t("Event updated successfully!"));
        }
        else {
          toast.error(response.payload.message || t("Failed to update event!"));
        }
      } else {
        const response = await dispatch(createEventThunk(data));
        if (response.payload.success) {

          toast.success(t("Event created successfully!"));
        }
        else {
          toast.error(response.payload.message || t("Failed to create event!"));
        }
      }
      handleSidebarClose();
      dispatch(fetchEventsThunk());
    } catch {
      toast.error(t("Failed to save event"));
    }
  };

  const handleEventClick = (evt) => {
    dispatch(setSelectedEvent(evt));
    dispatch(setSidebarContent("viewEvent"));
  };

  // Aggregate events by month and year for year view
  const getEventsByMonth = (year) => {
    const monthEvents = Array(12).fill(0);
    events.forEach((e) => {
      if (e.date) {
        const d = parseISO(e.date);
        if (isValid(d) && getYear(d) === year) {
          monthEvents[getMonth(d)] += 1;
        }
      }
    });
    return monthEvents;
  };

  // Calendar date-cell renderer
  const dateCellRender = (value) => {
    if (!events.length) return null;
    const cellDate = value.toDate();
    const formattedDate = isValid(cellDate)
      ? format(cellDate, "yyyy-MM-dd")
      : null;

    const dayEvents = events.filter((e) => {
      if (!e.date || !formattedDate) return false;
      const d = parseISO(e.date);
      return isValid(d) && format(d, "yyyy-MM-dd") === formattedDate;
    });

    return (
      <ul className="space-y-1 max-h-20 overflow-y-auto">
        {dayEvents.map((e) => {
          const idx = getColorIndex(e._id);
          return (
            <li
              key={e._id}
              className={`inline-block px-2 py-1 rounded text-white ${eventBadgeColors[idx]} shadow cursor-pointer`}
              onClick={() => handleEventClick(e)}
            >
              {e.title || t("Untitled event")} – {e.time || "-"}
            </li>
          );
        })}
      </ul>
    );
  };

  // Calendar month-cell renderer for year view
  const monthCellRender = (value) => {
    const year = value.year();
    const monthEvents = getEventsByMonth(year);
    const eventCount = monthEvents[value.month()];
    return eventCount > 0 ? (
      <div className="flex items-center justify-center h-full">
        <span className="text-center text-gray-700 font-medium">
          {eventCount} {eventCount === 1 ? t("Event") : t("Events")}
        </span>
      </div>
    ) : null;
  };

  // Sidebar title logic
  const sidebarTitle =
    sidebarContent === "viewEvent" && selectedEvent
      ? selectedEvent.title || t("Event details")
      : sidebarContent === "addEvent"
        ? t("Add New Event")
        : sidebarContent === "updateEvent"
          ? t("Update Event")
          : "";

  // Month & year options
  const now = new Date();
  const months = now.toLocaleDateString(undefined, { month: "short" });
  const currentYear = now.getFullYear();
  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i
  );

  return (
    <Layout title={`${t("Event")} | ${t("Student Diwan")}`}>
      <DashLayout>
        <ProtectedSection
          requiredPermission={PERMISSIONS.SHOW_EVENTS}
          title={t("Events")}
        >
          <div className="p-4 min-h-screen">
            {/* Header */}
            <div className="flex justify-between mb-4">
              <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
                {t("Events")}
              </h1>
              <ProtectedAction requiredPermission={PERMISSIONS.ADD_NEW_EVENT}>
                {!["parent", "student"].includes(role) && (
                  <button
                    onClick={() => dispatch(setSidebarContent("addEvent"))}
                    className="px-4 py-2 rounded bg-gradient-to-r from-red-500 to-purple-500 text-white hover:from-red-600 hover:to-purple-600"
                  >
                    {t("Add New Event")}
                  </button>
                )}
              </ProtectedAction>
            </div>

            {/* Card Grid or Skeleton */}
            <div className="relative my-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(itemsPerPage)
                    .fill(null)
                    .map((_, i) => (
                      <Skeleton
                        key={i}
                        active
                        paragraph={{ rows: 4 }}
                        className="w-full h-48"
                      />
                    ))}
                </div>
              ) : (
                <>
                  {currentPage > 0 && (
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
                    >
                      <IoIosArrowBack size={20} />
                    </button>
                  )}
                  {pagedEvents.length === 0 ? (
                    <div className="flex flex-col items-center text-gray-500 py-20">
                      <IoCalendarOutline size={48} />
                      <p>{t("No Events in this Month")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pagedEvents.map((evt) => (
                        <EventCard
                          key={evt._id}
                          event={evt}
                          colorIndex={getColorIndex(evt._id)}
                          onClick={() => handleEventClick(evt)}
                        />
                      ))}
                    </div>
                  )}
                  {(currentPage + 1) * itemsPerPage < sortedEvents.length && (
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
                    >
                      <IoIosArrowForward size={20} />
                    </button>
                  )}
                </>
              )}
            </div>

            <hr className="my-8" />

            {/* AntD Calendar with Selects */}
            <Calendar
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender} // Added for year view
              headerRender={({ value, type, onChange, onTypeChange }) => {
                const year = value.year();
                const month = value.month();
                const monthNames = value.localeData().monthsShort();
                return (
                  <div className="flex justify-end items-center space-x-2 mb-4">
                    <Select
                      value={year}
                      onChange={(y) => onChange(value.clone().year(y))}
                    >
                      {yearOptions.map((y) => (
                        <Option key={y} value={y}>
                          {y}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      value={month}
                      onChange={(m) => onChange(value.clone().month(m))}
                    >
                      {monthNames.map((m, i) => (
                        <Option key={i} value={i}>
                          {m}
                        </Option>
                      ))}
                    </Select>
                    <button
                      onClick={() => onTypeChange("month")}
                      className={`px-2 py-1 border rounded ${type === "month" ? "bg-red-500 text-white" : ""
                        }`}
                    >
                      {t("Month")}
                    </button>
                    <button
                      onClick={() => onTypeChange("year")}
                      className={`px-2 py-1 border rounded ${type === "year" ? "bg-red-500 text-white" : ""
                        }`}
                    >
                      {t("Year")}
                    </button>
                  </div>
                );
              }}
              className="custom-calendar"
            />

            {/* Sidebar */}
            <Sidebar
              title={sidebarTitle}
              isOpen={!!sidebarContent}
              onClose={handleSidebarClose}
              width="50%"
            >
              {sidebarContent === "viewEvent" && selectedEvent && (
                <ViewEvent onClose={handleSidebarClose} />
              )}
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