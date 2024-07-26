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
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import { FaCheck } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import AttendenceCard from "./AttendenceCard";
// import Layout from "../../../../../Components/Common/";
// import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { MdCancel } from "react-icons/md";
import { FcLeave } from "react-icons/fc";
const StudentAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
let student;
  const attendanceData = student?.attendance?.details.map((attendance) => ({
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
        bgColor = "gray";
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
     <div className="flex flex-row gap-3 p-4 ">
           <div className="w-[18rem]">
           <AttendenceCard
              icon={<FaCheck className="text-green-300 text-[2.5rem] font-bold border border-green-300 p-2 rounded-full" />}
              label="Total Present"
              value={ 0}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
           </div>
            <AttendenceCard
              icon={<MdCancel className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />}
              label="Total Absent"
              value={student?.finance?.parentsAccountTotalPaid | 0}
              onButtonClick={() => console.log("Message clicked")}
              buttonLabel={null}
            />
            <AttendenceCard
              icon={<FcLeave className="text-red-200 text-[2.5rem] font-bold border border-red-200 p-2 rounded-full" />}
              label="Total Leave"
              value={student?.finance
                ?.totalPaidFees | 0}
                buttonLabel={null}
              onButtonClick={() => console.log("Message clicked")}
            />
          </div>
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
