import React from 'react';
import AttendanceSummary from './AttendanceSummary';
import CalendarHeader from './Calender';
import StudentDashLayout from '../../../Components/Student/StudentDashLayout';


const AttendanceMain = () => {
    const handlePreviousMonth = () => {
        // Logic for previous month
    };

    const handleNextMonth = () => {
        // Logic for next month
    };

    return (
        <StudentDashLayout>
            <div className="container mx-auto py-4">
                <AttendanceSummary present={250} absent={116} leave={16} />
                <div className='border-b border-t border-gray-200 my-4 p-4'>
                    <CalendarHeader month="March" year="2024" onPreviousMonth={handlePreviousMonth} onNextMonth={handleNextMonth} />
                </div>
            </div>
        </StudentDashLayout>
    );
};

export default AttendanceMain;
