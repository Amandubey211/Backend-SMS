import React, { useEffect, useState } from 'react';
import checkboxIcon from '../../../Assets/ParentAssets/svg/checkbox.svg';
import crossIcon from '../../../Assets/ParentAssets/svg/cross.svg';
import leaveIcon from '../../../Assets/ParentAssets/svg/leave.png';
import { useTranslation } from "react-i18next";

const AttendanceCard = ({ presentCount = 0, absentCount = 0, leaveCount = 0 }) => {
  const { t } = useTranslation('prtChildrens');

  const totalPresent = t("Total Present");
  const totalAbsent = t("Total Absent");
  const totalLeave = t("Total Leave");

  const summaryData = [
    { title: totalPresent, value: presentCount, icon: checkboxIcon, color: 'bg-green-100' },
    { title: totalAbsent, value: absentCount, icon: crossIcon, color: 'bg-red-100' },
    { title: totalLeave, value: leaveCount, icon: leaveIcon, color: 'bg-purple-100', isGradient: true }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10 justify-between">
        {summaryData?.map((item, index) => (
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
      className={`h-[90px] w-[313px] rounded-lg shadow-md p-4 flex items-center justify-between ${cardStyle} transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105`}
    >
      <div className="flex items-center">
        <div className="bg-white rounded-full p-2 shadow-sm mr-3">
          <img src={data.icon} alt={data.title} className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{data.value}</span>
          <span className="text-sm font-medium text-gray-600">{data.title}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
