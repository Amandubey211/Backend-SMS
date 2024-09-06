import React, { useEffect, useState } from 'react';
import { Calendar as AntdCalendar, Spin } from 'antd';
import AttendanceCard from '../../../Modules/Parents/Attendance/AttendanceCard';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';
import presentIcon from '../../../Assets/ParentAssets/svg/present.svg';
import absentIcon from '../../../Assets/ParentAssets/svg/absent.svg';
import leaveIcon from '../../../Assets/ParentAssets/svg/leave.png';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importing an icon for error display
import './ChildrenAttendance.css';
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const Calendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = async (selectedMonth, selectedYear) => {
    console.log('Fetching attendance data...', { selectedMonth, selectedYear });
    const token = localStorage.getItem('parent:token');
    const childrenData = JSON.parse(localStorage.getItem('childrenData'));
    const studentId = childrenData && childrenData[0] ? childrenData[0].id : null;

    if (!studentId || !selectedMonth || !selectedYear) {
      console.error('Student ID, month, and year are required');
      setError('Student ID, month, and year are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/myAttendance`, {
        headers: { Authentication: `${token}` },
        params: { studentId, month: selectedMonth, year: selectedYear }
      });

      if (response.data && response.data.report && response.data.report.report) {
        setAttendanceData(response.data.report.report);
        setError(null);
      } else {
        throw new Error('No attendance data available');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error.message);
      setError('Unable to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(month, year);
  }, [month, year]);

  const handlePanelChange = (value) => {
    setMonth(value.month() + 1);
    setYear(value.year());
    setLoading(true);
  };
  useNavHeading("My Childs", "Attendance");

  return (
    <div className="calendar-container">
      <Spin spinning={loading} size="large" tip="Loading...">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
            <p className="text-gray-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="attendance-card-wrapper">
              <AttendanceCard attendanceData={attendanceData} />
            </div>
            <AntdCalendar 
              onPanelChange={handlePanelChange}
              dateCellRender={(value) => dateCellRender(value, attendanceData)}
            />
          </>
        )}
      </Spin>
    </div>
  );
};

const dateCellRender = (value, attendanceData) => {
  const listData = attendanceData.filter(entry => 
    new Date(entry.date).toDateString() === value.toDate().toDateString()
  );

  return (
    <ul className="events">
      {listData.map((item) => {
        let icon;
        switch (item.status) {
          case 'present':
            icon = <img src={presentIcon} alt="Present" className="icon-class" />;
            break;
          case 'absent':
            icon = <img src={absentIcon} alt="Absent" className="icon-class" />;
            break;
          case 'leave':
            icon = <img src={leaveIcon} alt="Leave" className="icon-class" />;
            break;
          default:
            return null;
        }
        return (
          <li key={item.date}>
            {icon} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </li>
        );
      })}
    </ul>
  );
};

export default Calendar;
