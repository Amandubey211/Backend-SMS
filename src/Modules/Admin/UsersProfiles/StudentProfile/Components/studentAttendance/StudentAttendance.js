import React, { useEffect, useState } from 'react';
import CalendarHeader from '../../../../../Student/StudentClass/SubClass/Components/Attendance/Calender';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaDoorOpen, FaTimesCircle } from 'react-icons/fa';
import { fetchStudentAttendance } from '../../../../../../Store/Slices/Admin/Users/Students/student.action';
import { FiLoader } from 'react-icons/fi';
import Spinner from '../../../../../../Components/Common/Spinner';
const StudentAttendance = ({ student }) => {
    const [currentDate, setCurrentDate] = useState(moment());
    const { StudentAttendance, StudentAttendanceSummary, loading } = useSelector((store) => store.admin.all_students);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchStudentAttendance({month:currentDate.month() + 1, year:currentDate.year(),studentId:student?._id}));
    }, [dispatch, currentDate])

    const onPanelChange = (value) => {
        setCurrentDate(value);
    };


    return (
        loading? <div className="flex w-full h-[90vh] flex-col items-center justify-center">
          <Spinner/>
            </div>:
        <div className="container mx-auto py-4">
            <div className="flex justify-around px-4  space-x-4">
                <div className="flex items-center bg-green-100 p-4 pl-10 rounded-lg w-1/3">
                    <div className='bg-white rounded-full p-4'>
                        <FaCheckCircle className="text-3xl text-green-500" />
                    </div>
                    <div className="flex flex-col items-start ml-4">
                        <span className="text-3xl text-gray-700">{StudentAttendanceSummary?.presentCount || 0}</span>
                        <span className="mt-1 text-green-600">Total Present</span>
                    </div>
                </div>
                <div className="flex items-center bg-red-100 p-4 rounded-lg w-1/3">
                    <div className='bg-white rounded-full p-4'>
                        <FaTimesCircle className="text-3xl text-red-500" />
                    </div>
                    <div className="flex flex-col items-start ml-4">
                        <span className="text-3xl text-gray-700">{StudentAttendanceSummary?.absentCount || 0}</span>
                        <span className="mt-1 text-red-600">Total Absent</span>
                    </div>
                </div>
                <div className="flex items-center bg-purple-100 p-4 rounded-lg w-1/3">
                    <div className='bg-white rounded-full p-4'>
                        <FaDoorOpen className="text-3xl text-purple-500" />
                    </div>
                    <div className="flex flex-col items-start ml-4">
                        <span className="text-3xl text-gray-700">{StudentAttendanceSummary?.leaveCount || 0}</span>
                        <span className="mt-1 text-purple-600">Total Leave</span>
                    </div>
                </div>
            </div>
            <div className='border-b border-t border-gray-200 my-4 p-4'>
                <CalendarHeader attendanceData={StudentAttendance}
                    onPanelChange={onPanelChange} />
            </div>
        </div>
    );
};

export default StudentAttendance;












