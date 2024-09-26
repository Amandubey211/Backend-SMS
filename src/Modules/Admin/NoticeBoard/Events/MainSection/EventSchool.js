import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createEventThunk,
  updateEventThunk,
  deleteEventThunk,
  fetchEventsThunk,
} from "../../../../../Store/Slices/Admin/Events/eventThunks";
import {
  setSelectedEvent,
  resetSelectedEvent,
  setSidebarContent,
  resetSidebarContent,
} from "../../../../../Store/Slices/Admin/Events/eventSlice";
import { format, isValid } from "date-fns";
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

  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEventThunk(selectedEvent._id));
      toast.success("Event deleted successfully!");
      handleSidebarClose();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const handleEventClick = (event) => {
    dispatch(setSelectedEvent(event));
    dispatch(setSidebarContent("viewEvent"));
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

          {/* Calendar Date Render */}
          <Calendar
            dateCellRender={(value) => {
              const formattedDate = format(value.toDate(), "yyyy-MM-dd");
              const dayEvents = events.filter((event) => {
                const eventDate = new Date(event.startDate);
                return (
                  isValid(eventDate) &&
                  format(eventDate, "yyyy-MM-dd") === formattedDate
                );
              });

              return (
                <ul className="events space-y-1">
                  {dayEvents.map((event) => (
                    <li key={event._id} className="event-item">
                      {event.title}
                    </li>
                  ))}
                </ul>
              );
            }}
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
