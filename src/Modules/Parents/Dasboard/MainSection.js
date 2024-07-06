import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashCard from "../Dasboard/Dashcard.js";
import { cardData as initialCardData } from '../Dasboard/DashboardData/CardData.js';
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dasboard/DashboardData/Students.js";
import NoticeBoard from "../Dasboard/NoticeModule/NoticeBoard.js";
import { RiBookOpenLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('parent:token');
    const response = await axios.get('http://localhost:8080/parent/api/dashboard/sections', {
      headers: {
        Authentication: `${token}`
      }
    });
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ParentSection = () => {
  const [cardData, setCardData] = useState(initialCardData);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDashboardData();
      if (data) {
        setCardData([
          {
            label: "Due Fees",
            value: data.dueFees.toString(),
            bgColor: "bg-rose-200",
            textColor: "text-rose-500",
            icon: <CiMoneyBill />,
            iconBackground: "bg-rose-800",
          },
          {
            label: "Upcoming Events",
            value: data.upcomingExamsCount.toString(),
            bgColor: "bg-green-200",
            textColor: "text-green-500",
            icon: <RiBookOpenLine />,
            iconBackground: "bg-green-800",
          },
          {
            label: "Result Published",
            value: data.publishedResultsCount.toString(),
            bgColor: "bg-teal-100",
            textColor: "text-teal-700",
            icon: <RiCalendarCheckLine />,
            iconBackground: "bg-teal-400",
          },
          {
            label: "Total Expense",
            value: data.totalExpenses.toString(),
            bgColor: "bg-purple-200",
            textColor: "text-purple-400",
            icon: <RiMoneyDollarBoxFill />,
            iconBackground: "bg-purple-500",
          },
        ]);
      }
    };

    getData();
  }, []);

  return (
    <div className="h-full w-full">
    <div className="w-full p-2">
        <div className="flex flex-wrap justify-center gap-3 py-4 ">
            {cardData?.map((item, index) => (
                <DashCard key={index} {...item} />
            ))}
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
           
            <div className="w-2/5">
                <StudentParentCard />
            </div>
            <div className="w-3/5 border-r">
                <NoticeBoard />
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
