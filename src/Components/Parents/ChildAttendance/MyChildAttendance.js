import React, { useEffect, useCallback, useState } from 'react';
import { Calendar as AntdCalendar } from 'antd';
import AttendanceCard from '../../../Modules/Parents/Attendance/AttendanceCard.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance } from '../../../Store/Slices/Parent/Children/children.action.js';
import { FaExclamationTriangle } from 'react-icons/fa';
import presentIcon from '../../../Assets/ParentAssets/svg/checkbox.svg';
import absentIcon from '../../../Assets/ParentAssets/svg/cross.svg';
import leaveIcon from '../../../Assets/ParentAssets/svg/leave.png';
import './ChildrenAttendance.css';
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { ThreeRectCardSkeleton } from '../../../Modules/Parents/Skeletons.js';
import { useTranslation } from "react-i18next";
import Layout from '../../Common/Layout.js';
import dayjs from 'dayjs'; // Ensure you are using dayjs

const MyChildAttendance = () => {
  const { t } = useTranslation('prtChildrens');
  const dispatch = useDispatch();
  const { loading, error, selectedChild } = useSelector((state) => state.Parent.children);

  const [attendanceData, setAttendanceData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const studentId = selectedChild?.id || null;

  useEffect(() => {
    const fetchData = async () => {
      if (studentId) {
        try {
          const response = await dispatch(fetchAttendance({ studentId, month, year })).unwrap();
          setAttendanceData(response);
        } catch (err) {
          console.error('Error fetching attendance:', err);
        }
      }
    };
    fetchData();
  }, [studentId, month, year, dispatch]);

  console.log("attendanceData", attendanceData);

  const attendanceEntries = attendanceData?.report?.attendanceEntries || [];
  const { presentCount = 0, absentCount = 0, leaveCount = 0 } = attendanceData?.report?.summary || {};

  const handlePanelChange = (value) => {
    setMonth(value.month() + 1);
    setYear(value.year());
  };

  const handleSelect = useCallback(() => {}, []);

  useNavHeading(t("My Childs"), t("Attendance"));

  const dateCellRender = useCallback((value) => {
    const cellDate = dayjs(value).format('YYYY-MM-DD');
    const listData = attendanceEntries.filter((entry) => entry.date === cellDate);

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
              {icon}
            </li>
          );
        })}
      </ul>
    );
  }, [attendanceEntries]);

  useEffect(() => {
    const removeCalendarButtons = () => {
      setTimeout(() => {
        // Remove the "Year" button
        const yearButton = document.querySelector('.ant-radio-button-wrapper input[value="year"]');
        if (yearButton) {
          yearButton.closest('.ant-radio-button-wrapper').remove();
        }
  
        // Remove the "Month" button
        const monthButton = document.querySelector('.ant-radio-button-wrapper input[value="month"]');
        if (monthButton) {
          monthButton.closest('.ant-radio-button-wrapper').remove();
        }
      }, 100); // Small delay to ensure the elements are in the DOM
    };
  
    removeCalendarButtons();
  }, []);
  

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <>
          <ThreeRectCardSkeleton />
          <AntdCalendar
            onPanelChange={handlePanelChange}
            onSelect={handleSelect}
            mode="month"
            dateCellRender={() => null}
          />
        </>
      );
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
          <AttendanceCard
            presentCount={presentCount}
            absentCount={absentCount}
            leaveCount={leaveCount}
          />
        </div>
        <AntdCalendar
          onPanelChange={handlePanelChange}
          onSelect={handleSelect}
          mode="month"
          dateCellRender={dateCellRender}
        />
      </>
    );
  }, [
    loading,
    error,
    presentCount,
    absentCount,
    leaveCount,
    handlePanelChange,
    handleSelect,
    dateCellRender,
  ]);

  return (
    <Layout title="Child Attendance | Parent">
      <div className="calendar-container">{renderContent()}</div>
    </Layout>
  );
};

export default MyChildAttendance;
