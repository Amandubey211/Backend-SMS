import React from 'react';
import { Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import data from "./AttendanceData/AttendenceData";

const AttendanceCard = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 ml-10 mr-10  sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {data.map((item, index) => (
          <CardComponent key={index} data={item} />
        ))}
      </div>
      <div className="mt-4 text-xl font-semibold">March-2024</div>
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
