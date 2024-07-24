import React, { useState, useEffect } from "react";
import { Calendar } from "antd";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import EventCard from "../subComponents/EventCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddEvent from "../subComponents/AddEvent";
import UpdateEvent from "../subComponents/UpdateEvent"; // Import UpdateEvent
import ViewEvent from "../subComponents/ViewEvent";
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/event';
import { format, parseISO } from 'date-fns';
import "../subComponents/customCalendar.css";

const EventScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        const mappedEvents = events.map(event => ({
          ...event,
          startDate: parseISO(event.date),
          endDate: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000),
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleDateCellRender = (value) => {
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const dayEvents = events.filter(
      (event) => format(event.startDate, "yyyy-MM-dd") === formattedDate
    );

    const bgColors = [
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-indigo-500",
    ];

    return (
      <ul className="events space-y-1 ">
        {dayEvents.map((event, index) => (
          <li
            key={event._id}
            className={`inline-block px-2 py-1 rounded text-white ${bgColors[index % bgColors.length]} shadow-md cursor-pointer`}
            onClick={() => handleStickerClick(event)}
          >
            {event.title} - {format(event.startDate, "hh:mm a")}
          </li>
        ))}
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
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, eventData);
      } else {
        await createEvent(eventData);
      }
      setSidebarOpen(false);
      const updatedEvents = await getEvents();
      setEvents(updatedEvents.map(event => ({
        ...event,
        startDate: parseISO(event.date),
        endDate: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000),
      })));
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedEvent._id);
      setSidebarOpen(false);
      const updatedEvents = await getEvents();
      setEvents(updatedEvents.map(event => ({
        ...event,
        startDate: parseISO(event.date),
        endDate: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000),
      })));
    } catch (error) {
      console.error('Failed to delete event:', error);
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
              setSidebarContent("updateEvent"); // Change to updateEvent
            }}
          />
        );
      case "addEvent":
        return <AddEvent onSave={handleSaveEvent} />;
      case "updateEvent":
        return <UpdateEvent event={selectedEvent} onSave={handleSaveEvent} />; // Use UpdateEvent
      default:
        return <div>Select an action</div>;
    }
  };

  const recentEvents = events.slice(0, 3);

  return (
    <>
      <Layout title="Event">
        <DashLayout>
          <div className="min-h-screen p-4 bg-gray-50">
            <div className="flex flex-row justify-between">
              <span>Student Events</span>
              <button
                className="h-10 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                onClick={handleAddEventClick}
              >
                Add New Event
              </button>
            </div>
            <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
              {recentEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <hr className="my-6 border-t-2 mt-12 " />
            <div className="py-7 ">
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
                          onChange(now);
                        }}
                      >
                        {monthOptions}
                      </select>
                      <div className="flex space-x-2">
                        <button
                          className={`border rounded px-2 py-1 ${type === "month" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : ""}`}
                          onClick={() => onTypeChange("month")}
                        >
                          Month
                        </button>
                        <button
                          className={`border rounded px-2 py-1 ${type === "year" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : ""}`}
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
              title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">{sidebarContent === "viewEvent" ? "View Event" : sidebarContent === "addEvent" ? "Add New Event" : "Update Event"}</span>}
            >
              {renderSidebarContent()}
            </Sidebar>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
};

export default EventScheduler;
