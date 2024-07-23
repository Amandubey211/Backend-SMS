import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "antd";
import Layout from "../../../Components/Common/Layout";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import EventCard from "./Events/subComponents/EventCard";
import Sidebar from "../../../Components/Common/Sidebar";
import ViewEvent from "./Events/subComponents/ViewEvent";
import "./Events/subComponents/customCalendar.css";
import { baseUrl } from "../../../config/Common";

const StudentEvent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Fetching events...");
      try {
        const token = localStorage.getItem("student:token");
        console.log("token in student event ", token);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${baseUrl}/admin/all/events`, {
          headers: {
            Authentication: token,
          },
        });

        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch events, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data parsed:", data);

        if (data.success && data.events) {
          const formattedEvents = data.events.map((event, index) => ({
            ...event,
            id: index, // Assign a unique ID based on the index
            startDate: new Date(event.date),
            endDate: new Date(
              new Date(event.date).setHours(new Date(event.date).getHours() + 2)
            ), // assuming a fixed duration of 2 hours
          }));
          console.log("Formatted events:", formattedEvents);
          setEvents(formattedEvents);
        } else {
          console.log("No events data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const dayEvents = events.filter(
      (event) =>
        new Date(event.startDate).toISOString().split("T")[0] === formattedDate
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
            key={event.id}
            className={`inline-block px-2 py-1 rounded text-white ${bgColors[index % bgColors.length]} shadow-md cursor-pointer`}
            onClick={() => handleStickerClick(event)}
          >
            {event.title}
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

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return <ViewEvent event={selectedEvent} />;
      default:
        return <div>Select an action</div>;
    }
  };

  return (
    <>
      <Layout title="Event">
        <StudentDashLayout>
          <div className="min-h-screen p-4 bg-gray-50">
            <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} onClick={handleStickerClick} />
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
                  console.log(months);

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
              onClose={() => setSidebarOpen(false)}
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
