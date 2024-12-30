import React, { useMemo } from "react";
import { Spin, Alert } from "antd";
import { AiFillAccountBook } from "react-icons/ai";
import { BiDonateHeart } from "react-icons/bi";
import { FaPlusCircle, FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlineMoneyOff } from "react-icons/md";
import { useSelector } from "react-redux";
import Card from "./Cards"; // Ensure Cards.jsx handles the 'compact' prop
import { useNavigate } from "react-router-dom";

const CardSection = () => {
  // Access cardDataRevenue, loading, and error from Redux store
  const { cardDataRevenue, loading, error } = useSelector(
    (state) => state.admin.earnings
  );
  const navigate = useNavigate();
  // Extract data with fallback to empty objects to avoid undefined errors
  const financialYearData = cardDataRevenue?.financialYear || {};
  const academicYearData = cardDataRevenue?.academicYear || {};
  const todayData = cardDataRevenue?.today || {};
  const currentMonthData = cardDataRevenue?.currentMonth || {};
  const profitLossPercentage = cardDataRevenue?.profitLossPercentage || 0;

  // Define four cards
  const cardDataWithValues = useMemo(() => {
    const cards = [
      {
        title: "Financial Year",
        dataPoints: [
          {
            title: "Total Revenue",
            value: `${financialYearData.totalRevenue || 0} QAR`,
          },
          {
            title: "Total Remaining Balance",
            value: `${financialYearData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${financialYearData.totalPaid || 0} QAR`,
          },
          {
            title: "Total Advance",
            value: `${financialYearData.totalAdvance || 0} QAR`,
          },
        ],
        icon: <AiFillAccountBook />,
        color: "purple",
      },
      {
        title: "Academic Year",
        dataPoints: [
          {
            title: "Total Revenue",
            value: `${academicYearData.totalRevenue || 0} QAR`,
          },
          {
            title: "Total Remaining Balance",
            value: `${academicYearData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${academicYearData.totalPaid || 0} QAR`,
          },
          {
            title: "Total Advance",
            value: `${academicYearData.totalAdvance || 0} QAR`,
          },
        ],
        icon: <BiDonateHeart />,
        color: "yellow",
      },
      {
        title: "Today",
        dataPoints: [
          {
            title: "Total Revenue",
            value: `${todayData.totalRevenue || 0} QAR`,
          },
          {
            title: "Total Remaining Balance",
            value: `${todayData.totalRemainingBalance || 0} QAR`,
          },
          { title: "Total Paid", value: `${todayData.totalPaid || 0} QAR` },
          {
            title: "Total Advance",
            value: `${todayData.totalAdvance || 0} QAR`,
          },
        ],
        icon: <FaRegMoneyBillAlt />,
        color: "green",
      },
      {
        title: "Current & Previous Month",
        dataPoints: [
          {
            title: "Total Revenue",
            value: `${currentMonthData.totalRevenue || 0} QAR`,
          },
          {
            title: "Total Remaining Balance",
            value: `${currentMonthData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${currentMonthData.totalPaid || 0} QAR`,
          },
          {
            title: "Total Advance",
            value: `${currentMonthData.totalAdvance || 0} QAR`,
          },
        ],
        icon: <MdOutlineMoneyOff />,
        color: "red",
        percentage: profitLossPercentage,
        trend: profitLossPercentage >= 0 ? "up" : "down",
      },
    ];

    return cards;
  }, [
    financialYearData,
    academicYearData,
    todayData,
    currentMonthData,
    profitLossPercentage,
  ]);

  // Map cardDataWithValues to custom Card components
  const compactCardMapping = useMemo(
    () =>
      cardDataWithValues.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          dataPoints={card.dataPoints}
          icon={card.icon}
          color={card.color}
          percentage={card.percentage}
          trend={card.trend}
        />
      )),
    [cardDataWithValues]
  );

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" tip="Loading cards..." />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <Alert message="Error loading cards." type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="w-full mb-2">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {compactCardMapping}
      </div>
      <div className="flex justify-end items-center mt-4 ">
        <button
          onClick={() => navigate("/finance/earning/add")}
          className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Earning</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FaPlusCircle size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CardSection;
