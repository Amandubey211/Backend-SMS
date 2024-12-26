
import React from "react";
import Card from "./Card"; // Reusing the Card component
import { FaUserGraduate, FaWallet, FaBookReader } from "react-icons/fa";
import { useSelector } from "react-redux";
const StudentCardSection = () => {
  const { unpaidRevenue,totalPaidAmount, totalRevenue} = useSelector(
    (state) => state.admin.earnings
      );
  const studentCardsData = [
    {
      title: "Total Fees Collected",
      value: `${totalPaidAmount || 0} QAR`,
      comparison: "Compared to (1,20,000 QAR last month)",
      percentage: 25,
      icon: <FaUserGraduate />,
      trend: "up",
    },
    {
      title: "Unpaid Fees",
      value: `${unpaidRevenue || 0} QAR`,
      comparison: "Compared to (20,000 QAR last month)",
      icon: <FaWallet />,
      trend: "up",
    },
    {
      title: "Total Unpaid & Paid",
      value: `${totalRevenue || 0} QAR`,
      comparison: "Compared to (25,000 QAR last month)",
      percentage: -20,
      icon: <FaBookReader />,
      trend: "down",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 place-items-center">
      {studentCardsData.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default StudentCardSection;
