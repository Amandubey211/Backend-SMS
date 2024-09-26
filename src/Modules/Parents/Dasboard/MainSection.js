import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashCard from "../Dasboard/Dashcard.js";
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dasboard/DashboardData/Students.js";
import NoticeBoard from "../Dasboard/NoticeModule/NoticeBoard.js";
import { RiBookOpenLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
import Spinner from "../../../Components/Common/Spinner";

// Thunks for fetching each section's data
import { fetchDashboardCards, fetchNotices, fetchChildren, fetchAccountingData } from '../../../Store/Slices/Parent/Dashboard/dashboard.action.js';

const ParentSection = () => {
  const dispatch = useDispatch();

  // Get the data from Redux
  const { cardsData = {}, childrenData = [], notices = [], accountingData = {}, loading, error } = useSelector((state) => state.Parent.dashboard || {});

  useEffect(() => {
    console.log("Dispatching fetch actions");
    dispatch(fetchDashboardCards());
    dispatch(fetchChildren());
    dispatch(fetchNotices());
    dispatch(fetchAccountingData());
  }, [dispatch]);
  
  useEffect(() => {
    if (cardsData && Object.keys(cardsData).length > 0) {
      console.log("Final card data: ", cardsData);
    } else {
      console.log("No card data found");
    }
  }, [cardsData]);
  
  
  const cardData = [
    {
      label: "Due Fees",
      value: cardsData?.dueFees?.toString() || "0",  // Debugging value
      bgColor: "bg-rose-200",
      textColor: "text-rose-500",
      icon: <CiMoneyBill />,
    },
    {
      label: "Upcoming Exams",
      value: cardsData?.upcomingExamsCount?.toString() || "0",  // Debugging value
      bgColor: "bg-green-200",
      textColor: "text-green-500",
      icon: <RiBookOpenLine />,
    },
    {
      label: "Result Published",
      value: cardsData?.publishedResultsCount?.toString() || "0",  // Debugging value
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      icon: <RiCalendarCheckLine />,
    },
    {
      label: "Total Expense",
      value: cardsData?.totalExpenses?.toString() || "0",  // Debugging value
      bgColor: "bg-purple-200",
      textColor: "text-purple-400",
      icon: <RiMoneyDollarBoxFill />,
    },
  ];
  
  console.log("Final card data: ", cardData);   // Debugging card data to ensure mapping is correct
  
  return (
    <div className="h-full w-full">
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-3 py-4">
          {console.log(cardData)}
          {cardData.map((item, index) => (
            <DashCard key={index} {...item} />
            
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-start border-y">
          <div className="w-2/5">
            <StudentParentCard students={childrenData} />
          </div>
          <div className="w-3/5 border-r">
            <NoticeBoard notices={notices} numberOfChildren={childrenData.length || 0} />
          </div>
        </div>
        <div className="flex justify-between items-start border-y">
          <div className="w-full">
            <AccountingSection accountingData={accountingData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSection;
