import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import EventCard from "../subComponents/EventCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddEvent from "../subComponents/AddEvent";
import UpdateEvent from "../subComponents/UpdateEvent";
import ViewEvent from "../subComponents/ViewEvent";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../api/event";
import { format, parseISO, isValid } from "date-fns";
import "../subComponents/customCalendar.css";
import toast from "react-hot-toast";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const EventScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // State for pagination
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  const itemsPerPage = 4; // Number of stickers to show per page

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        const mappedEvents = events.map((event) => ({
          ...event,
          startDate: parseISO(event.date),
          endDate: new Date(
            new Date(event.date).getTime() + 2 * 60 * 60 * 1000
          ),
        }));
        setEvents(mappedEvents);
        filterAndSortEvents(mappedEvents, selectedMonthYear);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents(events, selectedMonthYear);
  }, [selectedMonthYear, events]);

  const filterAndSortEvents = (events, { month, year }) => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    const sorted = filtered.sort((a, b) => a.startDate - b.startDate);

    setFilteredEvents(sorted);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => {
    console.log("Sidebar is closing");
    setSelectedEvent(null);
    setSidebarOpen(false);
  };

  const refreshEvents = async () => {
    console.log("Refreshing events");
    try {
      const updatedEvents = await getEvents();
      const mappedEvents = updatedEvents.map((event) => ({
        ...event,
        startDate: parseISO(event.date),
        endDate: new Date(
          new Date(event.date).getTime() + 2 * 60 * 60 * 1000
        ),
      }));

      setEvents(mappedEvents);
      filterAndSortEvents(mappedEvents, selectedMonthYear);
      console.log("Events refreshed");
    } catch (error) {
      console.error("Failed to refresh events:", error);
    }
  };

  const handleDateCellRender = (value) => {
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = filteredEvents.filter(
      (event) => format(event.startDate, "yyyy-MM-dd") === formattedDate
    );

    const bgColors = [
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-indigo-500",
    ];

    return (
      <ul className="events space-y-1">
        {dayEvents.map((event, index) => {
          const eventTime = event.time
            ? new Date(`${format(event.startDate, "yyyy-MM-dd")}T${event.time}`)
            : null;
          const timeString = isValid(eventTime)
            ? format(eventTime, "hh:mm a")
            : "Invalid Time";

          return (
            <li
              key={event._id}
              className={`inline-block px-2 py-1 rounded text-white ${
                bgColors[index % bgColors.length]
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

  const handleStickerClick = (event) => {
    setSelectedEvent(event);
    setSidebarContent("viewEvent");
    setSidebarOpen(true);
  };

  const handleAddEventClick = () => {
    setSidebarContent("addEvent");
    setSidebarOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      console.log("Saving event data:", eventData);
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, eventData);
        toast.success("Event updated successfully!");
        console.log("Event updated successfully!");
      } else {
        await createEvent(eventData);
        toast.success("Event created successfully!");
        console.log("Event created successfully!");
      }

      handleSidebarClose(); // Close the sidebar after success
      refreshEvents(); // Refresh the events list
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error("Failed to save event.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedEvent._id);
      handleSidebarClose();
      refreshEvents();
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event.");
    }
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return (
          <ViewEvent
            event={selectedEvent}
            onDelete={handleDeleteEvent}
            onEdit={() => {
              setSidebarContent("updateEvent");
            }}
          />
        );
      case "addEvent":
        return (
          <AddEvent onSave={handleSaveEvent} onClose={handleSidebarClose} />
        );
      case "updateEvent":
        return (
          <UpdateEvent
            event={selectedEvent}
            onSave={handleSaveEvent}
            onClose={handleSidebarClose}
          />
        );
      default:
        return <div>Select an action</div>;
    }
  };

  const bgColors = [
    "#FF6C9C", // pink
    "#E24DFF", // purple
    "#21AEE7", // blue
    "#FBB778", // orange
  ];

  const paginatedEvents = filteredEvents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <Layout title="Event">
      <DashLayout>
        <div className="min-h-screen p-4 bg-gray-50">
          <div className="flex flex-row justify-between">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Events
            </h1>
            <button
              className="h-10 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
              onClick={handleAddEventClick}
            >
              Add New Event
            </button>
          </div>
          <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4 relative">
            {currentPage > 0 && (
              <div
                className="p-1 rounded-full text-purple-500 bg-white border-2 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              >
                <IoIosArrowBack />
              </div>
            )}
            {paginatedEvents.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                color={bgColors[index % bgColors.length]}
                onClick={handleStickerClick}
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
                    <div className="flex space-x-2">
                      <button
                        className={`border rounded px-2 py-1 ${
                          type === "month"
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                            : ""
                        }`}
                        onClick={() => onTypeChange("month")}
                      >
                        Month
                      </button>
                      <button
                        className={`border rounded px-2 py-1 ${
                          type === "year"
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
            />
          </div>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                {sidebarContent === "viewEvent"
                  ? "View Event"
                  : sidebarContent === "addEvent"
                  ? "Add New Event"
                  : "Update Event"}
              </span>
            }
          >
            {renderSidebarContent()}
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default EventScheduler;
