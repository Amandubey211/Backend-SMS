import React, { useEffect, useState } from 'react';
import { Card, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AttendanceCard = ({ initialMonth, initialYear }) => {
  const currentDate = new Date();
  const [month, setMonth] = useState(initialMonth || currentDate.getMonth() + 1); // Months are 0-indexed in JavaScript Date
  const [year, setYear] = useState(initialYear || currentDate.getFullYear());
  const [summary, setSummary] = useState({
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      const token = localStorage.getItem('parent:token');
      const childrenData = JSON.parse(localStorage.getItem('childrenData'));
      const studentId = childrenData && childrenData[0] ? childrenData[0].id : null;

      if (!studentId || !month || !year) {
        console.error('Student ID, month, and year are required');
        setError('Student ID, month, and year are required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/parent/api/attendance`, {
          headers: {
            Authentication: `${token}`
          },
          params: {
            studentId,
            month,
            year
          }
        });

        if (response.data && response.data.report && response.data.report.summary) {
          setSummary(response.data.report.summary);
        } else {
          throw new Error('No report summary available');
        }
      } catch (error) {
        console.error('Error fetching attendance summary:', error);
        setError('🚨 Error fetching attendance summary: Please try again later. 🚨');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [month, year]);

  const handleMonthChange = (newMonth) => {
    setMonth(parseInt(newMonth));
    setLoading(true);
  };

  const handleYearChange = (newYear) => {
    setYear(parseInt(newYear));
    setLoading(true);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center font-bold text-xl p-4">
        {error}
      </div>
    );
  }

  const summaryData = [
    { title: 'Present', value: summary.presentCount, icon: 'present', color: 'bg-green-200' },
    { title: 'Absent', value: summary.absentCount, icon: 'absent', color: 'bg-red-200' },
    { title: 'Leave', value: summary.leaveCount, icon: 'leave', color: 'bg-yellow-200' }
  ];

  return (
    <div className="flex flex-col items-center overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[15vw] mt-10 justify-between px-16">
        {summaryData.map((item, index) => (
          <CardComponent key={index} data={item} />
        ))}
      </div>
      <div className="mt-4 text-xl font-semibold text-center">
        <Select
          style={{ width: 120, marginRight: 10 }}
          onChange={handleMonthChange}
          value={month}
        >
          {months.map((m) => (
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
          {years.map((y) => (
            <Option key={y} value={y}>
              {y}
            </Option>
          ))}
        </Select>
        {/* {`${month}-${year}`} */}
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
