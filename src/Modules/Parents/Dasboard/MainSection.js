import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashCard from "../Dasboard/Dashcard.js";
import AccountingSection from "../Accounting/MainSection/ParentAccounts.js";
import StudentParentCard from "../Dasboard/DashboardData/Students.js";
import NoticeBoard from "../Dasboard/NoticeModule/NoticeBoard.js";
import { RiBookOpenLine, RiMoneyDollarBoxFill, RiCalendarCheckLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import Spinner from "../../../Components/Common/Spinner";
import { useTranslation } from 'react-i18next'; // Import i18next hook
import { fetchDashboardCards, fetchNotices, fetchChildren, fetchAccountingData } from '../../../Store/Slices/Parent/Dashboard/dashboard.action.js';

const ParentSection = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(); // Initialize translation function
  
  const { cardsData = {}, childrenData = [], notices = [], accountingData = {}, loading, error } = useSelector((state) => state.Parent.dashboard || {});

  useEffect(() => {
    dispatch(fetchDashboardCards());
    dispatch(fetchChildren());
    dispatch(fetchNotices());
    dispatch(fetchAccountingData());
  }, [dispatch]);

  const cardData = [
    {
      label: t("Due Fees", { ns: "stdFinance" }), // Translation key for Due Fees
      value: cardsData?.dueFees?.toString() || "0",
      bgColor: "bg-rose-200",
      textColor: "text-rose-500",
      icon: <CiMoneyBill />,
    },
    {
      label: t("Upcoming Exams", { ns: "stdFinance" }), // Translation key for Upcoming Exams
      value: cardsData?.upcomingExamsCount?.toString() || "0",
      bgColor: "bg-green-200",
      textColor: "text-green-500",
      icon: <RiBookOpenLine />,
    },
    {
      label: t("Result Published", { ns: "stdFinance" }), // Translation key for Result Published
      value: cardsData?.publishedResultsCount?.toString() || "0",
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      icon: <RiCalendarCheckLine />,
    },
    {
      label: t("Total Expense", { ns: "stdFinance" }), // Translation key for Total Expense
      value: cardsData?.totalExpenses?.toString() || "0",
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
