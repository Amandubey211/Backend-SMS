import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const AttendanceCard = ({ attendanceData, isLoading }) => {
  const [summary, setSummary] = useState({ presentCount: 0, absentCount: 0, leaveCount: 0 });

  useEffect(() => {
    if (attendanceData && attendanceData.length > 0) {
      const presentCount = attendanceData.filter(item => item.status === 'present').length;
      const absentCount = attendanceData.filter(item => item.status === 'absent').length;
      const leaveCount = attendanceData.filter(item => item.status === 'leave').length;

      setSummary({ presentCount, absentCount, leaveCount });
    } else {
      setSummary({ presentCount: 0, absentCount: 0, leaveCount: 0 });
    }
  }, [attendanceData]);

  const summaryData = [
    { title: 'Present', value: summary.presentCount, icon: 'present', color: 'bg-green-100' },
    { title: 'Absent', value: summary.absentCount, icon: 'absent', color: 'bg-red-100' },
    { title: 'Leave', value: summary.leaveCount, icon: 'leave', color: 'bg-purple-100' }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10 justify-between">
        {isLoading ? (
          <Spin tip="Loading..." size="large" />
        ) : (
          summaryData.map((item, index) => (
            <CardComponent key={index} data={item} />
          ))
        )}
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

  console.log(`Rendering CardComponent for: ${data.title} with value: ${data.value}`);

  return (
    <Card className={`h-[95px] w-[200px] ${data.color} rounded-lg shadow-md flex flex-col items-center justify-center`}>
      <div className="text-[15px]">{iconComponents[data.icon]}</div>
      <div className="text-[15px] font-bold">{data.value}</div>
      <div className="text-[15px]">{data.title}</div>
    </Card>
  );
};

export default AttendanceCard;
