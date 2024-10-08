import React, { useEffect, useCallback, useState } from 'react';
import { Calendar as AntdCalendar } from 'antd';
import AttendanceCard from '../../../Modules/Parents/Attendance/AttendanceCard.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance } from '../../../Store/Slices/Parent/Children/children.action.js';
import { FaExclamationTriangle } from 'react-icons/fa'; // Error icon
import presentIcon from '../../../Assets/ParentAssets/svg/present.svg';
import absentIcon from '../../../Assets/ParentAssets/svg/absent.svg';
import leaveIcon from '../../../Assets/ParentAssets/svg/leave.png';
import './ChildrenAttendance.css';
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import CustomSpinner from '../../../Components/Common/Spinner.js'; // Custom loading spinner
import { useTranslation } from "react-i18next"; // Import useTranslation

const MyChildAttendance = () => {
  const { t } = useTranslation('prtChildrens'); // Initialize translation hook
  const dispatch = useDispatch();
  const { attendance, loading, error, children } = useSelector((state) => state.Parent.children); // Access Redux state
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Fetch the student ID from the Redux state
  const studentId = children?.[0]?.id || null;

  // Fetch attendance data when studentId, month, or year changes
  useEffect(() => {
    if (studentId) {
      dispatch(fetchAttendance({ studentId, month, year }));
    }
  }, [studentId, month, year, dispatch]);

  // Handle calendar panel change (month/year)
  const handlePanelChange = (value) => {
    setMonth(value.month() + 1);
    setYear(value.year());
  };

  useNavHeading(t("My Childs"), t("Attendance"));

  // Move dateCellRender function outside of any callback to follow React Hooks rules
  const dateCellRender = useCallback((value) => {
    const listData = attendance?.filter(entry => 
      new Date(entry.date).toDateString() === value.toDate().toDateString()
    );

    return (
      <ul className="events">
        {listData?.map((item) => {
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
  }, [attendance]);

  // Memoize the content rendering to avoid unnecessary re-renders
  const renderContent = useCallback(() => {
    if (loading) {
      return <CustomSpinner tip="Loading attendance data..." />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500">{error}</p>
        </div>
      );
    }



    return (
      <>
        <div className="attendance-card-wrapper">
          <AttendanceCard attendanceData={attendance} />
        </div>
        <AntdCalendar 
          onPanelChange={handlePanelChange}
          dateCellRender={dateCellRender}  // Pass dateCellRender directly here
        />
      </>
    );
  }, [loading, error, attendance, handlePanelChange, dateCellRender]);

  return <div className="calendar-container">{renderContent()}</div>;
};

export default MyChildAttendance;
