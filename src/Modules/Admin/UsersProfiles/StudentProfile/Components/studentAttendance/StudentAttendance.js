import React, { useEffect, useState } from 'react';
import AttendanceSummary from  '../../../../../Student/StudentClass/SubClass/Components/Attendance/AttendanceSummary';
import CalendarHeader from '../../../../../Student/StudentClass/SubClass/Components/Attendance/Calender';
import axios from 'axios';
import moment from 'moment';
import { baseUrl } from '../../../../../../config/Common';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';


const StudentAttendance = ({student}) => {
    const role = useSelector((store) => store.Auth.role);
    const [attendanceData, setAttendanceData] = useState({})
    const [currentDate, setCurrentDate] = useState(moment());
    const [summary, setSummary] = useState({ presentCount: 0, absentCount: 0, leaveCount: 0 });
   
    const fetchAttendance = async (month, year) => {
        try {
            const token = localStorage.getItem(`${role}:token`)
            if (!token) {
                throw new Error('Authentication not found');
            }

            const response = await axios.get(`${baseUrl}/api/studentDashboard/myAttendance`, {
                params: { month, year,studentId:student._id },
                headers: {
                    'Authentication': token
                }
            })

            const { report, summary } = response.data.report;
            const attendanceMap = report.reduce((acc, entry) => {
                acc[entry.date] = entry.status;
                return acc;
            }, {});
            setAttendanceData(attendanceMap);
            setSummary(summary);

        } catch (error) {
            console.error("Failed to fetch Attendance:", error);
        }
    }

    useEffect(() => {
        fetchAttendance(currentDate.month() + 1, currentDate.year());
    }, [currentDate])

    const onPanelChange = (value) => {
        setCurrentDate(value);
    };


    return (
            <div className="container mx-auto py-4">
                <AttendanceSummary present={summary.presentCount} absent={summary.absentCount} leave={summary.leaveCount} />
                <div className='border-b border-t border-gray-200 my-4 p-4'>
                    <CalendarHeader attendanceData={attendanceData}
                        onPanelChange={onPanelChange} />
                </div>
            </div>
    );
};

export default StudentAttendance;












