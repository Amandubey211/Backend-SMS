import React, { useEffect, useState, useCallback, memo } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";
import EventItem from "./EventItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { fetchFilteredEvents } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action"; // Import the action
import { useTranslation } from "react-i18next";

const monthNames = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract events, loading, and error from the Redux store
  const { events, loadingEvents: loading, errorEvents: error } = useSelector(
    (state) => state.admin.adminDashboard
  );

  const { t } = useTranslation("admEvent");

  const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
  const currentYear = new Date().getFullYear();

  const [date, setDate] = useState({ month: currentMonth, year: currentYear });

  const fetchEvents = useCallback(() => {
    dispatch(fetchFilteredEvents({ month: date.month, year: date.year }));
  }, [date, dispatch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleMonthChange = (newMonth, newYear) => {
    setDate({ month: newMonth, year: newYear });
    dispatch(fetchFilteredEvents({ month: newMonth, year: newYear })); // Dispatch API request immediately after date update
  };

  const handlePreviousMonth = () => {
    setDate((prevDate) => {
      const newMonth = prevDate.month === 1 ? 12 : prevDate.month - 1;
      const newYear = prevDate.month === 1 ? prevDate.year - 1 : prevDate.year;
      handleMonthChange(newMonth, newYear); // Update state and fetch events
      return { month: newMonth, year: newYear };
    });
  };

  const handleNextMonth = () => {
    setDate((prevDate) => {
      const newMonth = prevDate.month === 12 ? 1 : prevDate.month + 1;
      const newYear = prevDate.month === 12 ? prevDate.year + 1 : prevDate.year;
      handleMonthChange(newMonth, newYear); // Update state and fetch events
      return { month: newMonth, year: newYear };
    });
  };

  const handleViewAll = () => {
    navigate?.("/noticeboard/events");
  };

  const handleUpdateEvent = (updatedEvent) => {
    // Placeholder: Events will be re-fetched on update
  };

  const top5Events = events?.slice?.(0, 5) || [];

  return (
    <div className="max-w-4xl mx-auto text-gray-600 bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{t("Event")}</h2>
        <div className="flex items-center gap-3">
          <button
            className="p-1 border rounded-full"
            onClick={handlePreviousMonth}
          >
            <IoIosArrowBack />
          </button>
          <h3 className="text-lg font-medium">
            {monthNames?.[date?.month - 1]} {date?.year}
          </h3>
          <button className="p-1 border rounded-full" onClick={handleNextMonth}>
            <IoIosArrowForward />
          </button>
        </div>

        <button
          className="text-black border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300 ease-in-out"
          onClick={handleViewAll}
        >
          {t("View All")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 py-3 font-semibold text-left border-y border-gray-200">
        <h1>{t("Event Name")}</h1>
        <h1>{t("Event Type")}</h1>
        <h1>{t("Start Date")}</h1>
      </div>
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="flex justify-center items-center my-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center my-10">
            <FaCalendarAlt className="text-red-400 text-6xl mb-4" />
            <p className="text-gray-500 text-xl">Error: {error}</p>
          </div>
        ) : top5Events?.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-10">
            <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500 text-xl">{t("No events found")}</p>
          </div>
        ) : (
          top5Events?.map((event) => (
            <EventItem
              key={event?.id}
              event={event}
              onUpdate={handleUpdateEvent}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(Events);
