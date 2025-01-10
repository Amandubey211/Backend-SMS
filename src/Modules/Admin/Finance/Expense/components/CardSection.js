import React, { useMemo } from "react";
import { Spin, Alert } from "antd";
import { FaDollarSign, FaBook, FaBuilding, FaUniversity } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../Earnings/Components/Cards";

const CardSection = () => {
  const { cardDataExpense, loading, error } = useSelector(
    (state) => state.admin.expenses
  );
  const navigate = useNavigate();

  // Extract card data with fallback
  const financialYearData = cardDataExpense?.financialYear || {};
  const academicYearData = cardDataExpense?.academicYear || {};
  const todayData = cardDataExpense?.today || {};
  const currentMonthData = cardDataExpense?.currentMonth || {};
  const profitLossPercentage = cardDataExpense?.profitLossPercentage || 0;

  const cardDataWithValues = useMemo(() => {
    const cards = [
      {
        title: "Financial Year",
        dataPoints: [
          {
            title: "Total Expense",
            value: `${financialYearData.totalExpense || 0} QAR`,
          },
          {
            title: "Outstanding Balances",
            value: `${financialYearData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${financialYearData.totalPaid || 0} QAR`,
          },
          {
            title: "Unpaid Expense",
            value: `${financialYearData.unpaidExpense || 0} QAR`,
          },
        ],
        icon: <FaDollarSign />,
        color: "purple",
      },
      {
        title: "Academic Year",
        dataPoints: [
          {
            title: "Total Expense",
            value: `${academicYearData.totalExpense || 0} QAR`,
          },
          {
            title: "Outstanding Balances",
            value: `${academicYearData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${academicYearData.totalPaid || 0} QAR`,
          },
          {
            title: "Unpaid Expense",
            value: `${academicYearData.unpaidExpense || 0} QAR`,
          },
        ],
        icon: <FaBook />,
        color: "yellow",
      },
      {
        title: "Today",
        dataPoints: [
          {
            title: "Total Expense",
            value: `${todayData.totalExpense || 0} QAR`,
          },
          {
            title: "Outstanding Balances",
            value: `${todayData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${todayData.totalPaid || 0} QAR`,
          },
          {
            title: "Unpaid Expense",
            value: `${todayData.unpaidExpense || 0} QAR`,
          },
        ],
        icon: <FaBuilding />,
        color: "green",
      },
      {
        title: "Current & Previous Month",
        dataPoints: [
          {
            title: "Total Expense",
            value: `${currentMonthData.totalExpense || 0} QAR`,
          },
          {
            title: "Outstanding Balances",
            value: `${currentMonthData.totalRemainingBalance || 0} QAR`,
          },
          {
            title: "Total Paid",
            value: `${currentMonthData.totalPaid || 0} QAR`,
          },
          {
            title: "Unpaid Expense",
            value: `${currentMonthData.unpaidExpense || 0} QAR`,
          },
        ],
        icon: <FaUniversity />,
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

  // Map cardDataWithValues to compact Card components
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

  return (
    <div className="w-full mb-2">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {compactCardMapping}
      </div>
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => navigate("/finance/expenses/add")}
          className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
        >
          <span className="text-gray-800 font-medium">Add New Expense</span>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <FaDollarSign size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CardSection;
