


// import React, { useState } from "react";
// import Paper from "@mui/material/Paper";
// import {
//   Scheduler,
//   WeekView,
//   Appointments,
//   MonthView,
//   Toolbar,
//   DateNavigator,
//   TodayButton,
//   ViewSwitcher,
// } from "@devexpress/dx-react-scheduler-material-ui";
// import { ViewState } from "@devexpress/dx-react-scheduler";
// import Layout from "../../../Components/Common/Layout";
// import StudentDashLayout from "../../../Components/Student/StudentDashLayout";

// // import Layout from "../../../../../Components/Common/Layout";
// // import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
// import EventCard from "./Events/subComponents/EventCard";
// import Sidebar from "../../../Components/Common/Sidebar";
// import { schedulerData } from "../studentDummyData/studentDummyData";

// // import Sidebar from "../../../../../Components/Common/Sidebar";
// import ViewEvent from "./Events/subComponents/ViewEvent";
// import "./Events/subComponents/customCalendar.css"; // Ensure the CSS file is correctly referenced

// // import { schedulerData } from "../../../dummyData/dummyData";


// // Layout StudentDashLayout Sidebar    schedulerData vieweve

// const StudentEvent = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentViewName, setCurrentViewName] = useState("Month");
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [sidebarContent, setSidebarContent] = useState(null);
  
//   console.log(
//     "Event dates validation:",
//     schedulerData.map((event) => ({
//       startDateIsValid:
//         event.startDate instanceof Date && !isNaN(event.startDate.getDate()),
//       endDateIsValid:
//         event.endDate instanceof Date && !isNaN(event.endDate.getDate()),
//     }))
//   );

//   const handleSidebarOpen = () => setSidebarOpen(true);
//   const handleSidebarClose = () => setSidebarOpen(false);

//   const onCurrentDateChange = (date) => {
//     setCurrentDate(date);
//   };

//   const onCurrentViewNameChange = (viewName) => {
//     setCurrentViewName(viewName);
//   };

//   const Appointment = ({ children, data, style, ...restProps }) => (
//     <Appointments.Appointment
//       {...restProps}
//       onClick={() => handleAppointmentClick(data)}
//       className="custom-appointment"
//     >
//       {children}
//     </Appointments.Appointment>
//   );

//   const TimeTableCell = ({ children, ...restProps }) => (
//     <WeekView.TimeTableCell {...restProps} className="custom-time-table-cell">
//       {children}
//     </WeekView.TimeTableCell>
//   );

//   const DateTableCell = ({ children, ...restProps }) => (
//     <MonthView.DateTableCell
//       {...restProps}
//       className={`custom-date-table-cell ${restProps.className || ""}`}
//     >
//       {children}
//     </MonthView.DateTableCell>
//   );
  
//   const handleAppointmentClick = (appointmentData) => {
//     setSelectedEvent(appointmentData);

//     console.log(appointmentData);
//     setSidebarContent("viewEvent");
//     setSidebarOpen(true);
//   };

//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case "viewEvent":
//         return <ViewEvent event={selectedEvent} />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <>
//       <Layout title="Event">
//         <StudentDashLayout>
//           <div className="min-h-screen p-4 bg-gray-50">
//             <div className="flex flex-row justify-between">
//               <span>Student Events</span>
//             </div>
//             <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
//               {schedulerData.map((event) => (
//                 <EventCard key={event.id} event={event} />
//               ))}
//             </div>
//             <div className="py-7">
//               <Paper>
//                 <Scheduler data={schedulerData}>
//                   <ViewState
//                     currentDate={currentDate}
//                     currentViewName={currentViewName}
//                     onCurrentDateChange={onCurrentDateChange}
//                     onCurrentViewNameChange={onCurrentViewNameChange}
//                   />
//                   <WeekView timeTableCellComponent={TimeTableCell} />
//                   <MonthView dateTableCellComponent={DateTableCell} />
//                   <Toolbar />
//                   <DateNavigator />
//                   <TodayButton />
//                   <ViewSwitcher />
//                   <Appointments appointmentComponent={Appointment} />
//                 </Scheduler>
//               </Paper>
//             </div>
//             <Sidebar
//               isOpen={isSidebarOpen}
//               onClose={() => setSidebarOpen(false)}
//               title={
//                 <span className="bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
//                   View Event
//                 </span>
//               }
//             >
//               {renderSidebarContent()}
//             </Sidebar>
//           </div>
//         </StudentDashLayout>
//       </Layout>
//     </>
//   );
// };

// export default StudentEvent;

//---------------------------

// import React, { useState, useEffect } from 'react';
// import Paper from '@mui/material/Paper';
// import {
//   Scheduler,
//   WeekView,
//   Appointments,
//   MonthView,
//   Toolbar,
//   DateNavigator,
//   TodayButton,
//   ViewSwitcher,
// } from '@devexpress/dx-react-scheduler-material-ui';
// import { ViewState } from '@devexpress/dx-react-scheduler';
// import Layout from '../../../Components/Common/Layout';
// import StudentDashLayout from '../../../Components/Student/StudentDashLayout';
// import EventCard from './Events/subComponents/EventCard';
// import Sidebar from '../../../Components/Common/Sidebar';
// import ViewEvent from './Events/subComponents/ViewEvent'; // Assuming you have imported ViewEvent

// const StudentEvent = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentViewName, setCurrentViewName] = useState('Month');
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [sidebarContent, setSidebarContent] = useState(null);
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/admin/get_schedule_orientation'); // Adjust URL as per your backend setup
//       if (!response.ok) {
//         throw new Error('Failed to fetch events');
//       }
//       const data = await response.json();
//       setEvents(data.orientations);
//       console.log('Successfully fetched events:', data.orientations);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       // Handle error gracefully, e.g., show error message to the user
//     }
//   };

//   const handleSidebarOpen = () => setSidebarOpen(true);
//   const handleSidebarClose = () => setSidebarOpen(false);

//   const onCurrentDateChange = (date) => {
//     setCurrentDate(date);
//   };

//   const onCurrentViewNameChange = (viewName) => {
//     setCurrentViewName(viewName);
//   };

//   const Appointment = ({ children, data, style, ...restProps }) => (
//     <Appointments.Appointment
//       {...restProps}
//       onClick={() => handleAppointmentClick(data)}
//       className="custom-appointment"
//     >
//       {children}
//     </Appointments.Appointment>
//   );

//   const TimeTableCell = ({ children, ...restProps }) => (
//     <WeekView.TimeTableCell {...restProps} className="custom-time-table-cell">
//       {children}
//     </WeekView.TimeTableCell>
//   );

//   const DateTableCell = ({ children, ...restProps }) => (
//     <MonthView.DateTableCell
//       {...restProps}
//       className={`custom-date-table-cell ${restProps.className || ''}`}
//     >
//       {children}
//     </MonthView.DateTableCell>
//   );

//   const handleAppointmentClick = (appointmentData) => {
//     setSelectedEvent(appointmentData);
//     setSidebarContent('viewEvent');
//     setSidebarOpen(true);
//   };

//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case 'viewEvent':
//         return <ViewEvent event={selectedEvent} />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <Layout title="Event">
//       <StudentDashLayout>
//         <div className="min-h-screen p-4 bg-gray-50">
//           <div className="flex flex-row justify-between">
//             <span>Student Events</span>
//           </div>
//           <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
//             {events && events.length > 0 && events.map((event) => (
//               <EventCard key={event._id} event={event} />
//             ))}
//           </div>
//           <div className="py-7">
//             <Paper>
//               {/* <Scheduler data={events}>
//                 <ViewState
//                   currentDate={currentDate}
//                   currentViewName={currentViewName}
//                   onCurrentDateChange={onCurrentDateChange}
//                   onCurrentViewNameChange={onCurrentViewNameChange}
//                 />
//                 <WeekView timeTableCellComponent={TimeTableCell} />
//                 <MonthView dateTableCellComponent={DateTableCell} />
//                 <Toolbar />
//                 <DateNavigator />
//                 <TodayButton />
//                 <ViewSwitcher />
//                 <Appointments appointmentComponent={Appointment} />
//               </Scheduler> */}
//               <Scheduler data={events}>
//               <ViewState
//                 currentDate={currentDate}
//                 currentViewName={currentViewName}
//                 onCurrentDateChange={onCurrentDateChange}
//                 onCurrentViewNameChange={onCurrentViewNameChange}
//               />
//               <WeekView />
//               <MonthView />
//               <Toolbar />
//               <DateNavigator />
//               <TodayButton />
//               <ViewSwitcher />
//               <Appointments />
//             </Scheduler>
//             </Paper>
//           </div>
//           <Sidebar
//             isOpen={isSidebarOpen}
//             onClose={() => setSidebarOpen(false)}
//             title={<span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">View Event</span>}
//           >
//             {renderSidebarContent()}
//           </Sidebar>
//         </div>
//       </StudentDashLayout>
//     </Layout>
//   );
// };

// export default StudentEvent;



//-----------------------


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

// const StudentEvent = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentViewName, setCurrentViewName] = useState("Month");
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [sidebarContent, setSidebarContent] = useState(null);
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/admin/get_schedule_orientation');
//         const { orientations } = await response.json();
//         const formattedEvents = orientations.map(event => ({
//           ...event,
//           startDate: new Date(event.date),
//           endDate: new Date(new Date(event.date).setHours(new Date(event.date).getHours() + 2)) // assuming a fixed duration of 2 hours
//         }));
//         setEvents(formattedEvents);
//         console.log("event in student event ",events)
//       } catch (error) {
//         console.error("Failed to fetch events:", error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleAppointmentClick = (appointmentData) => {
//     setSelectedEvent(appointmentData);
//     setSidebarContent("viewEvent");
//     setSidebarOpen(true);
//   };
//   const Appointment = ({ children, data, style, ...restProps }) => (
//     <Appointments.Appointment
//       {...restProps}
//       onClick={() => handleAppointmentClick(data)}
//       style={{ ...style, cursor: 'pointer', backgroundColor: '#FF6C9C' }} // You can style here
//     >
//       {children}
//     </Appointments.Appointment>
//   );
//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case "viewEvent":
//         return <ViewEvent event={selectedEvent} />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <>
//       <Layout title="Event">
//         <StudentDashLayout>
//           <div className="min-h-screen p-4 bg-gray-50">
//             <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
//               {events.map((event) => (
//                 <EventCard key={event._id} event={event} />
//               ))}
//             </div>
//             <div className="py-7">
//               <Paper>
//                 <Scheduler data={events}>
//                   <ViewState
//                     currentDate={currentDate}
//                     currentViewName={currentViewName}
//                     onCurrentDateChange={setCurrentDate}
//                     onCurrentViewNameChange={setCurrentViewName}
//                   />
//                   <WeekView />
//                   <MonthView />
//                   <Toolbar />
//                   <DateNavigator />
//                   <TodayButton />
//                   <ViewSwitcher />
//                   <Appointments appointmentComponent={Appointments.Appointment} />
//                 </Scheduler>
//               </Paper>
//             </div>
//             <Sidebar
//               isOpen={isSidebarOpen}
//               onClose={() => setSidebarOpen(false)}
//               title="View Event"
//             >
//               {renderSidebarContent()}
//             </Sidebar>
//           </div>
//         </StudentDashLayout>
//       </Layout>
//     </>
//   );
// };

// export default StudentEvent;

//--------------------------

// const StudentEvent = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentViewName, setCurrentViewName] = useState("Month");
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [sidebarContent, setSidebarContent] = useState(null);
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/admin/get_schedule_orientation');
//         const { orientations } = await response.json();
//         const formattedEvents = orientations.map(event => ({
//           ...event,
//           startDate: new Date(event.date),
//           endDate: new Date(new Date(event.date).setHours(new Date(event.date).getHours() + 2)) // assuming a fixed duration of 2 hours
//         }));
//         setEvents(formattedEvents);
//       } catch (error) {
//         console.error("Failed to fetch events:", error);
//       }
//     };
//     fetchEvents();
//   }, []);



//   const handleAppointmentClick = (appointmentData) => {
//     setSelectedEvent(appointmentData);
//     setSidebarContent("viewEvent");
//     setSidebarOpen(true);
//   };

//   const Appointment = ({ children, data, style, ...restProps }) => (
//     <Appointments.Appointment
//       {...restProps}
//       onClick={() => handleAppointmentClick(data)}
//       style={{ ...style, cursor: 'pointer', backgroundColor: '#FF6C9C' }} // You can style here
//     >
//       {children}
//     </Appointments.Appointment>
//   );

//   const renderSidebarContent = () => {
//     switch (sidebarContent) {
//       case "viewEvent":
//         return <ViewEvent event={selectedEvent} />;
//       default:
//         return <div>Select an action</div>;
//     }
//   };

//   return (
//     <>
//       <Layout title="Event">
//         <StudentDashLayout>
//           <div className="min-h-screen p-4 bg-gray-50">
//             <div className="my-4 w-full h-40 flex justify-around rounded-sm gap-4">
//               {events.map((event) => (
//                 <EventCard key={event._id} event={event} />
//               ))}
//             </div>
//             <div className="py-7">
//               <Paper>
//                 <Scheduler data={events}>
//                   <ViewState
//                     currentDate={currentDate}
//                     currentViewName={currentViewName}
//                     onCurrentDateChange={setCurrentDate}
//                     onCurrentViewNameChange={setCurrentViewName}
//                   />
//                   <WeekView />
//                   <MonthView />
//                   <Toolbar />
//                   <DateNavigator />
//                   <TodayButton />
//                   <ViewSwitcher />
//                   <Appointments appointmentComponent={Appointment} />
//                 </Scheduler>
//               </Paper>
//             </div>
//             <Sidebar
//               isOpen={isSidebarOpen}
//               onClose={() => setSidebarOpen(false)}
//               title="View Event"
//             >
//               {renderSidebarContent()}
//             </Sidebar>
//           </div>
//         </StudentDashLayout>
//       </Layout>
//     </>
//   );
// };

// export default StudentEvent;


//----------------------


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