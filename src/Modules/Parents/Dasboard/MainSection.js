import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import DashCard from "../Dasboard/Dashcard.js";
import { cardData as initialCardData } from '../Dasboard/DashboardData/CardData.js';
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dasboard/DashboardData/Students.js";
import NoticeBoard from "../Dasboard/NoticeModule/NoticeBoard.js";
import { RiBookOpenLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
import { baseUrl } from '../../../config/Common.js';
import Spinner from "../../../Components/Common/Spinner"; // Import Spinner
import { fetchParentDashboardData } from "../../../Store/Slices/Parent/dashboardSlice.js";

const ParentSection = () => {
  const dispatch = useDispatch();

  // Get the data from Redux
  const { dashboardData = {}, loading } = useSelector((state) => state.Parent || {});

  useEffect(() => {
    dispatch(fetchParentDashboardData());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  const cardData = [
    {
      label: "Due Fees",
      value: dashboardData.dueFees?.toString() || "0",
      bgColor: "bg-rose-200",
      textColor: "text-rose-500",
      icon: <CiMoneyBill />,
    },
    {
      label: "Upcoming Exams",
      value: dashboardData.upcomingExamsCount?.toString() || "0",
      bgColor: "bg-green-200",
      textColor: "text-green-500",
      icon: <RiBookOpenLine />,
    },
    {
      label: "Result Published",
      value: dashboardData.publishedResultsCount?.toString() || "0",
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      icon: <RiCalendarCheckLine />,
    },
    {
      label: "Total Expense",
      value: dashboardData.totalExpenses?.toString() || "0",
      bgColor: "bg-purple-200",
      textColor: "text-purple-400",
      icon: <RiMoneyDollarBoxFill />,
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-3 py-4">
          {cardData.map((item, index) => (
            <DashCard key={index} {...item} />
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-2/5">
            <StudentParentCard />
          </div>
          <div className="w-3/5 border-r">
            <NoticeBoard numberOfChildren={dashboardData.childrenCount || 0} />
          </div>
        </div>
        <div className="flex justify-between items-start border-y">
          <div className="w-full">
            <AccountingSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;


