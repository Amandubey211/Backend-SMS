import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardCards } from '../../../Store/Slices/Parent/Dashboard/dashboard.action.js';
import { RiBookOpenLine, RiMoneyDollarBoxFill, RiCalendarCheckLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { useTranslation } from 'react-i18next'; // Import i18next hook
import { fetchNoticesThunk } from "../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks.js";
import { fetchAllNotices } from "../../../Store/Slices/Parent/NoticeBoard/notice.action.js";

const DashCard = ({
  label,
  value,
  bgColor,
  textColor,
  icon,
}) => {
  const { notices} = useSelector((state) => state?.Parent?.notice || {});
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllNotices());
  }, [dispatch]);
  const { t } = useTranslation(); // Initialize translation function

  // Fetch cardsData from Redux if props are not passed
  const { cardsData = {} } = useSelector((state) => state.Parent.dashboard || {});

  useEffect(() => {
    // Fetch dashboard cards only if props are not passed
    if (!label || !value) {
      dispatch(fetchDashboardCards());
    }
  }, [dispatch, label, value]);

  // Define cardData if no props are passed, fallback to Redux state
  const cardData = label && value ? [{
    label,
    value,
    bgColor,
    textColor,
    icon
  }] : [
    {
      label: t("Due Fees", { ns: "stdFinance" }),
      value: cardsData?.dueFees?.toString() || "0",
      bgColor: "bg-rose-200",
      textColor: "text-rose-500",
      icon: <CiMoneyBill />,
    },
    {
      label: t("Upcoming Exams", { ns: "stdFinance" }),
      value: cardsData?.upcomingExamsCount?.toString() || "0",
      bgColor: "bg-green-200",
      textColor: "text-green-500",
      icon: <RiBookOpenLine />,
    },
    {
      label: t("Notices", { ns: "stdFinance" }),
      value: notices?.length?.toString() || "0",
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      icon: <RiCalendarCheckLine />,
    },
    {
      label: t("Total Expense", { ns: "stdFinance" }),
      value: cardsData?.totalExpenses?.toString() || "0",
      bgColor: "bg-purple-200",
      textColor: "text-purple-400",
      icon: <RiMoneyDollarBoxFill />,
    },
  ];

  return (
    <div className="flex justify-around py-4 gap-1  w-full px-2"> {/* Adjusted padding */}
      {cardData.map((item, index) => (
        <div 
          key={index} 
          className={`p-4 px-6  flex-none w-[24%]  rounded-lg border ${item.bgColor} hover:shadow-lg transition-shadow duration-200`} // Adjusted padding, margin, and width
        >
          <div className="flex gap-4 items-center"> {/* Adjusted gap between icon and text */}
            {/* Icon */}
            <div className={`p-3 bg-white ${item.textColor} rounded-full shadow-xl text-3xl`}> {/* Adjusted icon size */}
              {item.icon}
            </div>
            
            {/* Number and Label in a column */}
            <div className="flex flex-col">
              {/* Value */}
              <div className="text-xl font-bold">{item.value}</div> {/* Adjusted value font size */}
              
              {/* Label */}
              <div className={`mt-2 text-md ${item.textColor}`}>{item.label}</div> {/* Adjusted label font size */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashCard;
