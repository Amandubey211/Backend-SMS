

import React, { useState, useEffect } from "react";
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
import Layout from "../../../Components/Common/Layout";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import EventCard from "./Events/subComponents/EventCard";
import Sidebar from "../../../Components/Common/Sidebar";
import ViewEvent from "./Events/subComponents/ViewEvent";
import "./Events/subComponents/customCalendar.css"; 

const StudentEvent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Fetching events...");
      try {
        const token = localStorage.getItem('student:token');
        console.log("token in student event ",token)
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://localhost:8080/student/all/events', {
          headers: {
            // 'Authorization': `Bearer ${token}`
            'Authorization': token
          }
        });

        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch events, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data parsed:", data);
        
        if (data.success && data.events) {
          const formattedEvents = data.events.map(event => ({
            ...event,
            startDate: new Date(event.date),
            endDate: new Date(new Date(event.date).setHours(new Date(event.date).getHours() + 2)) // assuming a fixed duration of 2 hours
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



  const handleAppointmentClick = (appointmentData) => {
    setSelectedEvent(appointmentData);
    setSidebarContent("viewEvent");
    setSidebarOpen(true);
  };

  const Appointment = ({ children, data, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      onClick={() => handleAppointmentClick(data)}
      style={{ ...style, cursor: 'pointer', backgroundColor: '#FF6C9C' }}
    >
      {children}
    </Appointments.Appointment>
  );

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
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <div className="py-7">
              <Paper>
                <Scheduler data={events}>
                  <ViewState
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentDateChange={setCurrentDate}
                    onCurrentViewNameChange={setCurrentViewName}
                  />
                  <WeekView />
                  <MonthView />
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
              onClose={() => setSidebarOpen(false)}
              title="View Event"
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