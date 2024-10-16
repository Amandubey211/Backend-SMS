import React, { useState, useEffect } from "react";
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
import { format, isValid, parse } from "date-fns";
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


const EventScheduler = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const dispatch = useDispatch();
  const { events, selectedEvent, sidebarContent } = useSelector(
    (state) => state.admin.events
  );
  const role = useSelector((state) => state.common.auth.role);

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  const filteredEvents = events.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleSidebarClose = () => {
    dispatch(resetSelectedEvent());
    dispatch(resetSidebarContent());
  };
  useNavHeading(role, "Events");

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        await dispatch(updateEventThunk(eventData));
        toast.success("Event updated successfully!");
      } else {
        await dispatch(createEventThunk(eventData));
        toast.success("Event created successfully!");
      }
      handleSidebarClose();
    } catch (error) {
      toast.error("Failed to save event");
    }
  };

  // const handleDeleteEvent = async () => {
  //   try {
  //     await dispatch(deleteEventThunk(selectedEvent._id));
  //     toast.success("Event deleted successfully!");
  //     handleSidebarClose();
  //   } catch (error) {
  //     toast.error("Failed to delete event");
  //   }
  // };

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
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = events.filter(
      (event) => format(new Date(event?.date), "yyyy-MM-dd") === formattedDate
    );

    const bgColors = ["bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-indigo-500"];

    return (
      <ul className="events space-y-1 max-h-20 overflow-y-auto">
        {dayEvents.map((event, index) => {
          let formattedTime = "No time"; // Default fallback for time
          if (event?.time) {
            try {
              // Since all times in the DB are in "hh:mm a" format, directly parse it this way
              const eventTime = parse(event?.time, "hh:mm a", new Date("1970-01-01"));
              formattedTime = isValid(eventTime) ? format(eventTime, "hh:mm a") : "No time";
            } catch (error) {
              console.error("Error formatting time:", error);
            }
          }

          return (
            <li
              key={event?._id}
              className={`inline-block px-2 py-1 rounded text-white ${bgColors[index % bgColors.length]
                } shadow-md cursor-pointer`}
              onClick={() => handleEventClick(event)}
            >
              {event?.title} - {formattedTime}
            </li>
          );
        })}
      </ul>
    );
  };


  const sidebarTitle =
    sidebarContent === "viewEvent" && selectedEvent
      ? selectedEvent.title
      : sidebarContent === "addEvent"
        ? "Add New Event"
        : sidebarContent === "updateEvent"
          ? "Update Event"
          : "Sidebar";

  return (
    <Layout title="Event | Student Diwan">
      <DashLayout>
        <div className="min-h-screen p-4 bg-gray-50 max-w-screen">
          <div className="flex flex-row justify-between">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Events
            </h1>
            {role === "admin" && (
              <button
                className="h-10 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                onClick={() => dispatch(setSidebarContent("addEvent"))}
              >
                Add New Event
              </button>
            )}
          </div>

          {/* Event Cards Pagination */}
          <div className="my-4 h-40 flex rounded-sm gap-8 pl-8 relative">
            {currentPage > 0 && (
              <div
                className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              >
                <IoIosArrowBack />
              </div>
            )}
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 w-full">
                <IoCalendarOutline className="text-6xl" />
                <span>No Events in this Month</span>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))
            )}
            {(currentPage + 1) * itemsPerPage < events.length && (
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
                      Month
                    </button>
                    <button
                      className={`border rounded px-2 py-1 ${type === "year"
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
            // Customize week day display
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
              <p>No event selected</p>
            ) : null}

            {sidebarContent === "addEvent" && (
              <AddEvent onSave={handleSaveEvent} />
            )}

            {sidebarContent === "updateEvent" && (
              <UpdateEvent onSave={handleSaveEvent} />
            )}
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default EventScheduler;
