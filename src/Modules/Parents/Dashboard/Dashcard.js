import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardCards } from "../../../Store/Slices/Parent/Dashboard/dashboard.action.js";
import { RiBookOpenLine, RiMoneyDollarBoxFill, RiCalendarCheckLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { useTranslation } from "react-i18next"; // Import i18next hook
import { fetchAllNotices } from "../../../Store/Slices/Parent/NoticeBoard/notice.action.js";
import { ParentDashcard } from "../Skeletons.js";


const DashCard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(); // Initialize translation function

  // Get data from Redux store
  const { cardsData = {}, loading } = useSelector((state) => state?.Parent?.dashboard || {}); // Ensure loading state exists
  const [isLoading, setIsLoading] = useState(true); // Local loading state

  useEffect(() => {
    dispatch(fetchDashboardCards());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsLoading(false), 1000); // Simulate loading delay for smoother UX
    }
  }, [loading]);

  // Define card data
  const cardData = [
    {
      label: t("Outstanding Fees", { ns: "stdFinance" }),
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
      label: t("Upcoming Notices", { ns: "stdFinance" }),
      value: cardsData?.notices?.toString() || "0",
      bgColor: "bg-teal-100",
      textColor: "text-teal-700",
      icon: <RiCalendarCheckLine />,
    },
    {
      label: t("Payable Fees", { ns: "stdFinance" }),
      value: cardsData?.totalExpenses?.toString() || "0",
      bgColor: "bg-purple-200",
      textColor: "text-purple-400",
      icon: <RiMoneyDollarBoxFill />,
    },
  ];

  return (
    <div className="flex justify-around py-4 gap-1 w-full px-2">
      {cardData.map((item, index) => (
        <div
          key={index}
          className={`p-4 px-6 flex-none w-[24%] rounded-lg border ${item.bgColor} hover:shadow-lg transition-shadow duration-200`}
        >
          {isLoading ? (
            <ParentDashcard />
          ) : (
            <div className="flex gap-4 items-center">
              {/* Icon */}
              <div className={`p-3 bg-white ${item.textColor} rounded-full shadow-xl text-3xl`}>
                {item.icon}
              </div>

              {/* Number and Label */}
              <div className="flex flex-col">
                <div className="text-xl font-bold">{item?.value}</div>
                <div className={`mt-2 text-md ${item?.textColor}`}>{item?.label}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashCard;
