import React from 'react';
import checkboxIcon from '../../../Assets/ParentAssets/svg/checkbox.svg';
import crossIcon from '../../../Assets/ParentAssets/svg/cross.svg';
import leaveIcon from '../../../Assets/ParentAssets/svg/leave.png';
import { useTranslation } from "react-i18next";

const AttendanceCard = ({ presentCount = 0, absentCount = 0, leaveCount = 0 }) => {
  const { t } = useTranslation('prtChildrens');

  const summaryData = [
    { title: t("Total Present"), value: presentCount, icon: checkboxIcon, color: 'bg-green-100' },
    { title: t("Total Absent"), value: absentCount, icon: crossIcon, color: 'bg-red-100' },
    { title: t("Total Leave"), value: leaveCount, icon: leaveIcon, color: 'bg-purple-100', isGradient: true }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {summaryData.map((item, index) => (
          <CardComponent key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

const CardComponent = ({ data }) => {
  const cardStyle = data.isGradient
    ? 'bg-gradient-to-b from-[#FAECF0] to-[#F3EBFB]'
    : data.color;

  return (
    <div
      className={`w-full rounded-lg shadow-md p-6  flex items-center justify-between ${cardStyle}`}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-white rounded-full p-3 shadow-sm">
          <img src={data.icon} alt={data.title} className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{data.value}</span>
          <span className="text-sm font-medium text-gray-700">{data.title}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
