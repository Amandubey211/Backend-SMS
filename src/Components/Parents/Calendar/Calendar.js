import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar } from 'antd';
import { dateCellRender } from '../../../Modules/Parents/utils/dateCellRender';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';
import './ChildrenAttendance.css';

const Calendar = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0
  });

  const fetchAttendanceData = async (year, month) => {
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
          month: month + 1, 
          year,
          studentId
        }
      });

      const { report, summary } = response.data.report;

      setAttendanceData(report.map(entry => ({
        date: entry.date,
        status: entry.status
      })));
      setSummary(summary);
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
      <div className="summary-cards">
        <div className="summary-card bg-green-100">
          <p>Present: {summary.presentCount}</p>
        </div>
        <div className="summary-card bg-red-100">
          <p>Absent: {summary.absentCount}</p>
        </div>
        <div className="summary-card bg-purple-100">
          <p>Leave: {summary.leaveCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
