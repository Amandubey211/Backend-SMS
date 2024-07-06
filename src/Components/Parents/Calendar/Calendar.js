import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar } from 'antd';
import { dateCellRender } from '../../../Modules/Parents/utils/dateCellRender';
import './ChildrenAttendance.css';
import axios from 'axios';

const Calendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendanceData = async (year, month) => {
    const token = localStorage.getItem('parent:token');
    const childrenData = JSON.parse(localStorage.getItem('childrenData'));
    const studentId = childrenData && childrenData[0] ? childrenData[0].id : null;

    if (!studentId) {
      console.error('No student ID found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/parent/api/attendance', {
        headers: {
          Authentication: `${token}`
        },
        params: {
          studentId,
          month: month + 1, 
          year
        }
      });

      const data = response.data.report.attendanceEntries.map(entry => ({
        date: entry.date,
        status: entry.status
      }));
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const onPanelChange = (value) => {
    const year = value.year();
    const month = value.month();
    fetchAttendanceData(year, month);
  };

  useEffect(() => {
    const now = new Date();
    fetchAttendanceData(now.getFullYear(), now.getMonth());
  }, []);

  return (
    <div className="calendar-container">
      <AntCalendar 
        cellRender={(value) => dateCellRender(value, attendanceData)} 
        onPanelChange={onPanelChange} 
      />
    </div>
  );
};

export default Calendar;
