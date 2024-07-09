import React, { useState } from "react";
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
import "../subComponents/customCalendar.css"; // Ensure the CSS file is correctly referenced
import EventCard from "../subComponents/EventCard";

import Sidebar from "../../../../../Components/Common/Sidebar";
import AddBook from "../../../Libary/SubClass/component/AddBook";
import AddEvent from "../subComponents/AddEvent";
import ViewEvent from "../subComponents/ViewEvent";
import { schedulerData } from "../../../dummyData/dummyData";

const EventScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  // const schedulerData = [
  //   {
  //     // start: new Date(2024, 2, 2, 9, 30),
  //     // end: new Date(2024, 2, 2, 11, 30),
  //     // allDay: false,
  //     startDate: new Date(2024, 2, 2, 9, 30), // March 2, 2024, 9:30 AM
  //     endDate: new Date(2024, 2, 2, 11, 30), // March 2, 2024, 11:30 AM
  //     title: "Event One",
  //     id: 1,
  //   },
  //   {
  //     // start: new Date(2024, 2, 2, 9, 30),
  //     // end: new Date(2024, 2, 2, 11, 30),
  //     // allDay: false,
  //     startDate: new Date(2024, 2, 6, 9, 30), // March 6, 2024, 9:30 AM
  //     endDate: new Date(2024, 2, 6, 11, 30), // March 6, 2024, 11:30 AM
  //     title: "Event Two",
  //     id: 2,
  //   },
  //   {
  //     // Event 3
  //     startDate: new Date(2024, 5, 5, 9, 0), // June 5, 2023, 9:00 AM
  //     endDate: new Date(2024, 5, 5, 11, 0), // June 5, 2023, 11:00 AM
  //     title: "Event Three",
  //     id: 3,
  //   },
  //   {
  //     // Event 4
  //     startDate: new Date(2024, 5, 7, 13, 0), // June 7, 2023, 1:00 PM
  //     endDate: new Date(2024, 5, 8, 15, 0), // June 7, 2023, 3:00 PM
  //     title: "Event Four",
  //     id: 4,
  //   },
  //   {
  //     // Event 5
  //     startDate: new Date(2024, 5, 16, 11, 0), // June 10, 2023, 11:00 AM
  //     endDate: new Date(2024, 5, 18, 13, 0), // June 10, 2023, 1:00 PM
  //     title: "Event Five",
  //     id: 5,
  //   }
  //   // Add more events as needed
  // ];

  // const schedulerData = [
  //   {
  //     startDate: new Date(2024,5, 6, 9, 30), // March 2, 2024, 9:30 AM
  //     endDate: new Date(2024, 5, 6, 11, 30), // March 2, 2024, 11:30 AM
  //     title: "Founder Meet Founder Meet Founder Meet  ",
  //     id: 1,
  //     type: "College Holiday",
  //     location: "School grounds",
  //     director: "Abul Kasem Khan",
  //     details: "Lorem Ipsum is simply dummy text of psum is simply dummy text of thpsum is simply dummy text of thpsum is simply dummy text of thpsum is simply dummy text of ththe printing and typesetting industry.",
  //     imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D", // Example placeholder image
  //     students: [
  //       { photo: "https://via.placeholder.com/40", name: "Student 1" },
  //       { photo: "https://via.placeholder.com/40", name: "Student 2" },
  //       // More students...
  //     ]
  //   },
  //   {
  //     startDate: new Date(2024, 2, 5, 10, 0), // March 5, 2024, 10:00 AM
  //     endDate: new Date(2024, 2, 5, 12, 0), // March 5, 2024, 12:00 PM
  //     title: "Spring Cultural at the National university ",
  //     id: 2,
  //     type: "Cultural Event",
  //     location: "Auditorium",
  //     director: "Ayesha Rahman",
  //     details: "An event showcasing cultural performances and exhibitions.",
  //     imageUrl: "https://via.placeholder.com/150",
  //     students: [
  //       { photo: "https://via.placeholder.com/40", name: "Student 3" },
  //       { photo: "https://via.placeholder.com/40", name: "Student 4" },
  //       // More students...
  //     ]
  //   },
  //   {
  //     startDate: new Date(2024, 2, 10, 14, 0), // March 10, 2024, 2:00 PM
  //     endDate: new Date(2024, 2, 10, 16, 0), // March 10, 2024, 4:00 PM
  //     title: "Science Fair",
  //     id: 3,
  //     type: "Educational Event",
  //     location: "Science Block",
  //     director: "Dr. Ahmed Hossain",
  //     details: "Students showcase their science projects and experiments.",
  //     imageUrl: "https://via.placeholder.com/150",
  //     students: [
  //       { photo: "https://via.placeholder.com/40", name: "Student 5" },
  //       { photo: "https://via.placeholder.com/40", name: "Student 6" },
  //       // More students...
  //     ]
  //   },
  //   {
  //     startDate: new Date(2024, 2, 15, 9, 0), // March 15, 2024, 9:00 AM
  //     endDate: new Date(2024, 2, 15, 11, 0), // March 15, 2024, 11:00 AM
  //     title: "Art Exhibition",
  //     id: 4,
  //     type: "Exhibition",
  //     location: "Art Gallery",
  //     director: "Sarah Islam",
  //     details: "Display of artworks by students and local artists.",
  //     imageUrl: "https://via.placeholder.com/150",
  //     students: [
  //       { photo: "https://via.placeholder.com/40", name: "Student 7" },
  //       { photo: "https://via.placeholder.com/40", name: "Student 8" },
  //       // More students...
  //     ]
  //   },
  //   {
  //     startDate: new Date(2024, 2, 20, 13, 0), // March 20, 2024, 1:00 PM
  //     endDate: new Date(2024, 2, 20, 15, 0), // March 20, 2024, 3:00 PM
  //     title: "Music Concert",
  //     id: 5,
  //     type: "Concert",
  //     location: "Main Hall",
  //     director: "Rashidul Karim",
  //     details: "An evening of musical performances by students and guest artists.",
  //     imageUrl: "https://via.placeholder.com/150",
  //     students: [
  //       { photo: "https://via.placeholder.com/40", name: "Student 9" },
  //       { photo: "https://via.placeholder.com/40", name: "Student 10" },
  //       // More students...
  //     ]
  //   },

  // ];

  // Console log to debug date objects
  console.log(
    "Event dates validation:",
    schedulerData.map((event) => ({
      startDateIsValid:
        event.startDate instanceof Date && !isNaN(event.startDate.getDate()),
      endDateIsValid:
        event.endDate instanceof Date && !isNaN(event.endDate.getDate()),
    }))
  );

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const onCurrentDateChange = (date) => {
    setCurrentDate(date);
  };

  const onCurrentViewNameChange = (viewName) => {
    setCurrentViewName(viewName);
  };

  const Appointment = ({ children, data, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      onClick={() => handleAppointmentClick(data)}
      className="custom-appointment"
    >
      {children}
    </Appointments.Appointment>
  );

  const TimeTableCell = ({ children, ...restProps }) => (
    <WeekView.TimeTableCell {...restProps} className="custom-time-table-cell">
      {children}
    </WeekView.TimeTableCell>
  );

  const DateTableCell = ({ children, ...restProps }) => (
    <MonthView.DateTableCell
      {...restProps}
      className={`custom-date-table-cell ${restProps.className || ""}`}
    >
      {children}
    </MonthView.DateTableCell>
  );
  const handleAppointmentClick = (appointmentData) => {
    setSelectedEvent(appointmentData);

    console.log(appointmentData);
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
                // onClick={handleSidebarOpen}
                onClick={handleAddEventClick}
              >
                Add New Event
              </button>
            </div>
            <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
              {schedulerData.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="py-7">
              <Paper>
                <Scheduler data={schedulerData}>
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
            {/* <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={sidebarContent=='viewEvent'?'view Event':'Add New Event'}
          >
            <AddEvent />
            {renderSidebarContent()}
          </Sidebar> */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
              title={
                <span className="bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                  {sidebarContent === "viewEvent"
                    ? "View Event"
                    : "Add New Event"}
                </span>
              }
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
