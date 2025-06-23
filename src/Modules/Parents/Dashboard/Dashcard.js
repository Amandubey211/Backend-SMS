import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardCards } from "../../../Store/Slices/Parent/Dashboard/dashboard.action.js";
import { RiBookOpenLine, RiCalendarCheckLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { FaBell } from "react-icons/fa"; // for the bell icon
import { useTranslation } from "react-i18next";
import { ParentDashcard } from "../Skeletons.js";
import { useNavigate } from "react-router-dom";
import { TbMoneybag } from "react-icons/tb";

const DashCard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Get data from Redux store
  const { cardsData = {}, loading } = useSelector(
    (state) => state?.Parent?.dashboard || {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDashboardCards());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [loading]);

  // Card configuration for the UI
  const cardData = [
    {
      label: t("Total paid", { ns: "stdFinance" }),
      value: cardsData?.totalPaid?.toString() || "0",
      cardBg: "bg-violet-100", // Pastel background
      hexBg: "bg-violet-500", // Darker color for hex shape
      icon: <TbMoneybag />,
    },
    {
      label: t("Due Fees", { ns: "stdFinance" }),
      value: cardsData?.dueFees?.toString() || "0",
      cardBg: "bg-rose-100",
      hexBg: "bg-rose-500",
      icon: <CiMoneyBill />,
      path: "/parentfinance",
    },
    {
      label: t("Upcoming Event", { ns: "stdFinance" }),
      value: cardsData?.eventsCount?.toString() || "0",
      cardBg: "bg-blue-100",
      hexBg: "bg-blue-500",
      icon: <RiCalendarCheckLine />,
      path: "/parent/events",
    },
    {
      label: t("Upcoming Notice", { ns: "stdFinance" }),
      value: cardsData?.notices?.toString() || "0",
      cardBg: "bg-orange-100",
      hexBg: "bg-orange-500",
      icon: <FaBell />,
      path: "/parentchildnotice",
    },
  ];

  return (
    <div className="flex justify-around gap-4  w-full ">
      {cardData.map((item, index) => (
        <div
          key={index}
          className={`relative flex flex-col items-center justify-center w-[200px] p-4 rounded-lg shadow-sm ${item.cardBg} cursor-pointer`}
          onClick={() => navigate(item?.path)}
        >
          {isLoading ? (
            <ParentDashcard />
          ) : (
            <>
              {/* Hex-shaped icon container */}
              <div
                className={`w-12 h-12 flex items-center justify-center text-white mb-2 ${item.hexBg}`}
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
              >
                {item.icon}
              </div>
              {/* Label and Value */}
              <div className="text-gray-800 font-semibold text-sm text-center">
                {item.label}
              </div>
              <div className="text-xl font-bold text-gray-700">
                {item.value}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashCard;
