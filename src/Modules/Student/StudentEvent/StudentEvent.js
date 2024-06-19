


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
import Layout from "../../../Components/Common/Layout";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";

// import Layout from "../../../../../Components/Common/Layout";
// import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import EventCard from "./Events/subComponents/EventCard";
import Sidebar from "../../../Components/Common/Sidebar";
import { schedulerData } from "../studentDummyData/studentDummyData";

// import Sidebar from "../../../../../Components/Common/Sidebar";
import ViewEvent from "./Events/subComponents/ViewEvent";
import "./Events/subComponents/customCalendar.css"; // Ensure the CSS file is correctly referenced

// import { schedulerData } from "../../../dummyData/dummyData";


// Layout StudentDashLayout Sidebar    schedulerData vieweve

const StudentEvent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  
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
            <div className="flex flex-row justify-between">
              <span>Student Events</span>
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
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
              title={
                <span className="bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                  View Event
                </span>
              }
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
