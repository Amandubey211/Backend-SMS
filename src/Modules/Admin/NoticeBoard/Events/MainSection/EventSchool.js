import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  WeekView,
  Appointments,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";

import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import "../subComponents/customCalendar.css";
import EventCard from "../subComponents/EventCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddEvent from "../subComponents/AddEvent";
import ViewEvent from "../subComponents/ViewEvent";
import { baseUrl } from "../../../../../config/Common";

const EventScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [events, setEvents] = useState([]); // State to store fetched events

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('admin:token'); // Retrieve the token from localStorage
      if (!token) {
        console.error('Authorization token is not available.');
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/admin/all/events`, {
          headers: {
            'Authentication': `${token}` // Use token in the Authorization header
          }
        });
        const mappedEvents = response.data.events.map(event => ({
          id: event._id,
          startDate: new Date(event.date), // Convert date to JavaScript Date object
          endDate: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000), // Assuming a fixed 2-hour duration for all events
          title: event.title,
          type: event.type,
          location: event.location,
          director: event.director,
          description: event.description,
          image: event.image,
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
  const onCurrentDateChange = (date) => setCurrentDate(date);
  const onCurrentViewNameChange = (viewName) => setCurrentViewName(viewName);

  const Appointment = ({ children, data, style, ...restProps }) => (
    <Appointments.Appointment {...restProps} onClick={() => handleAppointmentClick(data)}>
      {children}
    </Appointments.Appointment>
  );

  const TimeTableCell = ({ children, ...restProps }) => (
    <WeekView.TimeTableCell {...restProps} className="custom-time-table-cell">
      {children}
    </WeekView.TimeTableCell>
  );

  const DateTableCell = ({ children, ...restProps }) => (
    <MonthView.DateTableCell {...restProps} className={`custom-date-table-cell ${restProps.className || ""}`}>
      {children}
    </MonthView.DateTableCell>
  );

  const handleAppointmentClick = (appointmentData) => {
    setSelectedEvent(appointmentData);
    setSidebarContent("viewEvent");
    setSidebarOpen(true);
  };

  const handleAddEventClick = () => {
    setSidebarContent("addEvent");
    setSidebarOpen(true);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewEvent":
        return <ViewEvent event={selectedEvent} />;
      case "addEvent":
        return <AddEvent />;
      default:
        return <div>Select an action</div>;
    }
  };

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
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="py-7">
              <Paper>
                <Scheduler data={events}>
                  <ViewState
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentDateChange={onCurrentDateChange}
                    onCurrentViewNameChange={onCurrentViewNameChange}
                  />
                  <WeekView timeTableCellComponent={TimeTableCell} />
                  <MonthView dateTableCellComponent={DateTableCell} />
                  <Toolbar />
                  <DateNavigator />
                  <TodayButton />
                  <ViewSwitcher />
                  <Appointments appointmentComponent={Appointment} />
                </Scheduler>
              </Paper>
            </div>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">{sidebarContent === "viewEvent" ? "View Event" : "Add New Event"}</span>}
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
