import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar } from 'antd';
import { dateCellRender } from '../../../Modules/Parents/utils/dateCellRender';
import './ChildrenAttendance.css';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';

const Calendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // +1 because months are 0-indexed

  const fetchAttendanceData = async (year, month) => {
    console.log(`API call initiated: Fetching attendance data for Year: ${year}, Month: ${month}`);
    
    const token = localStorage.getItem('parent:token');
    const childrenData = JSON.parse(localStorage.getItem('childrenData'));
    const studentId = childrenData && childrenData[0] ? childrenData[0].id : null;

    if (!studentId) {
      console.error('No student ID found');
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/myAttendance`, {
        headers: {
          Authentication: `${token}`
        },
        params: {
          month,
          year,
          studentId
        }
      });

      console.log('API response received:', response.data);

      const data = response.data.report.report.map(entry => ({
        date: entry.date,
        status: entry.status
      }));

      console.log('Processed attendance data:', data);

      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const onPanelChange = (value) => {
    const newYear = value.year();
    const newMonth = value.month() + 1; // month is 0-indexed

    console.log(`Month/Year changed: New Year: ${newYear}, New Month: ${newMonth}`);

    setYear(newYear);
    setMonth(newMonth);

    // Fetch data for the new month/year
    fetchAttendanceData(newYear, newMonth);
  };

  useEffect(() => {
    console.log('Initial fetch of attendance data.');
    fetchAttendanceData(year, month);
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
