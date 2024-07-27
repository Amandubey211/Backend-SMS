import React, { useEffect, useState } from 'react';
import AttendanceSummary from  '../../../../../Student/Attendance/AttendanceSummary';
import CalendarHeader from '../../../../../Student/Attendance/Calender';
import axios from 'axios';
import moment from 'moment';
import { baseUrl } from '../../../../../../config/Common';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';


const StudentAttendance = () => {
    const {cid} = useParams()
    const [attendanceData, setAttendanceData] = useState({})
    const [currentDate, setCurrentDate] = useState(moment());
    const [summary, setSummary] = useState({ presentCount: 0, absentCount: 0, leaveCount: 0 });
    const role = useSelector((store) => store.Auth.role);
    const fetchAttendance = async (month, year) => {
        try {
            const token = localStorage.getItem(`${role}:token`)
            if (!token) {
                throw new Error('Authentication not found');
            }

            const response = await axios.get(`${baseUrl}/api/teacher/attendance/studentAttendance?startDate=2000-05-10&endDate=${currentDate}&studentId=${cid}`, {
                
                headers: {
                    'Authentication': token
                }
            })
            const { report, summary } = response.data.report;
            const attendanceMap = report.reduce((acc, entry) => {
                acc[entry.date.slice(0,10)] = entry.status;
                return acc;
            }, {});
            console.log(response);
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
