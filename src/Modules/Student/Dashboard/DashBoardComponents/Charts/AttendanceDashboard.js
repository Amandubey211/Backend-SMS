import React, { useEffect, useState } from 'react';
import AttendanceChart from './AttendanceChart'; // Replace with your actual component import

const AttendanceDashboard = () => {
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const token = localStorage.getItem('student:token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        // const response = await fetch('http://localhost:8080/student/dashboard/student');
        
        // const response = await fetch(`http://localhost:8080/student/dashboard/student`, {
          const response = await fetch(`http://localhost:8080/api/studentDashboard/dashboard/student`, {

          // 
            headers: {
              'Authentication': token
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
        const data = await response.json();
        console.log("attendance symmyary data",data)
        setAttendanceSummary(data.data.attendanceSummary);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance summary:', error);
        setError('Failed to fetch attendance data');
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Prepare data for the AttendanceChart component
  const attendanceData = [
    { month: 'January', present: attendanceSummary.present[0], absent: attendanceSummary.absent[0], late: attendanceSummary.late[0], leave: attendanceSummary.leave[0] },
    { month: 'February', present: attendanceSummary.present[1], absent: attendanceSummary.absent[1], late: attendanceSummary.late[1], leave: attendanceSummary.leave[1] },
    { month: 'March', present: attendanceSummary.present[2], absent: attendanceSummary.absent[2], late: attendanceSummary.late[2], leave: attendanceSummary.leave[2] },
    { month: 'April', present: attendanceSummary.present[3], absent: attendanceSummary.absent[3], late: attendanceSummary.late[3], leave: attendanceSummary.leave[3] },
    { month: 'May', present: attendanceSummary.present[4], absent: attendanceSummary.absent[4], late: attendanceSummary.late[4], leave: attendanceSummary.leave[4] },
    { month: 'June', present: attendanceSummary.present[5], absent: attendanceSummary.absent[5], late: attendanceSummary.late[5], leave: attendanceSummary.leave[5] },
    { month: 'July', present: attendanceSummary.present[6], absent: attendanceSummary.absent[6], late: attendanceSummary.late[6], leave: attendanceSummary.leave[6] },
    { month: 'August', present: attendanceSummary.present[7], absent: attendanceSummary.absent[7], late: attendanceSummary.late[7], leave: attendanceSummary.leave[7] },
    { month: 'September', present: attendanceSummary.present[8], absent: attendanceSummary.absent[8], late: attendanceSummary.late[8], leave: attendanceSummary.leave[8] },
    { month: 'October', present: attendanceSummary.present[9], absent: attendanceSummary.absent[9], late: attendanceSummary.late[9], leave: attendanceSummary.leave[9] },
    { month: 'November', present: attendanceSummary.present[10], absent: attendanceSummary.absent[10], late: attendanceSummary.late[10], leave: attendanceSummary.leave[10] },
    { month: 'December', present: attendanceSummary.present[11], absent: attendanceSummary.absent[11], late: attendanceSummary.late[11], leave: attendanceSummary.leave[11] },
  ];

  return (
    <div className="attendance-dashboard">
      <h2>Monthly Attendance Summary</h2>
      <AttendanceChart data={attendanceData} />
    </div>
  );
};

export default AttendanceDashboard;
