import React, { useEffect, useState } from 'react';
import { Card, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';

const { Option } = Select;

const AttendanceCard = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [summary, setSummary] = useState({ presentCount: 0, absentCount: 0, leaveCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceSummary = async (selectedMonth, selectedYear) => {
    const token = localStorage.getItem('parent:token');
    const childrenData = JSON.parse(localStorage.getItem('childrenData'));
    const studentId = childrenData && childrenData[0] ? childrenData[0].id : null;

    if (!studentId || !selectedMonth || !selectedYear) {
      setError('Student ID, month, and year are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/api/studentDashboard/myAttendance`, {
        headers: { Authentication: `${token}` },
        params: { studentId, month: selectedMonth, year: selectedYear }
      });

      if (response.data && response.data.report && response.data.report.summary) {
        setSummary(response.data.report.summary);
      } else {
        throw new Error('No report summary available');
      }
    } catch (error) {
      setError('🚨 Error fetching attendance summary: Please try again later. 🚨');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary(month, year);
  }, [month, year]);

  const handleMonthChange = (newMonth) => {
    setMonth(parseInt(newMonth));
    setLoading(true);
    fetchAttendanceSummary(parseInt(newMonth), year);
  };

  const handleYearChange = (newYear) => {
    setYear(parseInt(newYear));
    setLoading(true);
    fetchAttendanceSummary(month, parseInt(newYear));
  };

  const summaryData = [
    { title: 'Present', value: summary.presentCount, icon: 'present', color: 'bg-green-100' },
    { title: 'Absent', value: summary.absentCount, icon: 'absent', color: 'bg-red-100' },
    { title: 'Leave', value: summary.leaveCount, icon: 'leave', color: 'bg-purple-100' }
  ];

  if (loading) {
    return <div className="text-center text-xl p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center font-bold text-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10 justify-between">
        {summaryData.map((item, index) => (
          <CardComponent key={index} data={item} />
        ))}
      </div>
      <div className="mt-4 text-xl font-semibold text-center">
        <Select
          className="mr-2"
          style={{ width: 120 }}
          onChange={handleMonthChange}
          value={month}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <Option key={m} value={m}>
              {m}
            </Option>
          ))}
        </Select>
        <Select
          style={{ width: 120 }}
          onChange={handleYearChange}
          value={year}
        >
          {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map((y) => (
            <Option key={y} value={y}>
              {y}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

const CardComponent = ({ data }) => {
  const iconComponents = {
    present: <CheckCircleOutlined className="text-2xl" />,
    absent: <CloseCircleOutlined className="text-2xl" />,
    leave: <ClockCircleOutlined className="text-2xl" />
  };

  return (
    <Card className={`h-[95px] w-[200px] ${data.color} rounded-lg shadow-md flex flex-col items-center justify-center`}>
      <div className="text-[15px]">{iconComponents[data.icon]}</div>
      <div className="text-[15px] font-bold">{data.value}</div>
      <div className="text-[15px]">{data.title}</div>
    </Card>
  );
};

export default AttendanceCard;
