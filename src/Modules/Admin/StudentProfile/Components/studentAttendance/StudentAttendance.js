//---------------------

import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { format } from "date-fns";
import { ViewState } from "@devexpress/dx-react-scheduler";

import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";

const StudentAttendance = ({ student }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const attendanceData = student.attendance.details.map((attendance) => ({
    startDate: attendance.startDate,
    endDate: attendance.endDate,
    title: attendance.type,
  }));

  console.log("Attendancedara", attendanceData);

  const CustomAppointment = ({ children, style, ...restProps }) => {
    console.log("Appointment data:", restProps.data);
    let bgColor;
    switch (restProps.data.title) {
      case "Attend":
        bgColor = "green";
        break;
      case "Absent":
        bgColor = "yellow";
        break;
      case "Leave":
        bgColor = "red";
        break;
      default:
        bgColor = "sky"; // Default color if no type matches
        break;
    }

    const customStyle = { ...style, backgroundColor: bgColor };
    return (
      <Appointments.Appointment {...restProps} style={customStyle}>
        {children}
      </Appointments.Appointment>
    );
  };
  const DateTableCell = ({ onDoubleClick, ...restProps }) => {
    const formattedDate = format(restProps.startDate, "yyyy-MM-dd");
    const dayData = attendanceData.find(
      (data) => data.startDate === formattedDate
    );

    let bgColorClass;
    switch (dayData?.title) {
      case "Attend":
        bgColorClass = "bg-green-200"; 
        break;
      case "Absent":
        bgColorClass = "bg-red-200"; 
        break;
      case "Leave":
        bgColorClass = "bg-yellow-200"; 
        break;
      default:
        bgColorClass = "bg-white";
        break;
    }

    return (
      <MonthView.DateTableCell
        {...restProps}
        className={`${bgColorClass} custom-date-table-cell`}
        onDoubleClick={onDoubleClick}
      />
    );
  };

  return (
    <>
      <div className="min-h-screen p-4 bg-gray-50">
        <Paper>
          <Scheduler data={attendanceData} height={660}>
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={(date) => setCurrentDate(date)}
            />
            <MonthView dateTableCellComponent={DateTableCell} />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            {/* <Appointments /> */}
            <Appointments appointmentComponent={CustomAppointment} />
          </Scheduler>
        </Paper>
      </div>
    </>
  );
};

export default StudentAttendance;

//-----------------------------------------------
