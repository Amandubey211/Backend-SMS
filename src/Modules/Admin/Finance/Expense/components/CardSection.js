// // src/Modules/Admin/Finance/Components/CardSection.js

// import React, { useState, useMemo } from "react";
// import { Select, Spin, Alert } from "antd";
// import { useSelector } from "react-redux";
// import {
//   FaDollarSign,
//   FaBook,
//   FaBuilding,
//   FaUniversity,
//   FaPlusCircle,
//   FaFilter,
// } from "react-icons/fa";
// import Card from "../../StudentFees/Components/Card"; // Ensure the path is correct
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;

// const CardSection = () => {
//   const [selectedFilter, setSelectedFilter] = useState("financialYear");

//   const { cardDataExpense, loading, error } = useSelector(
//     (state) => state.admin.expenses
//   );

//   const navigate = useNavigate();

//   const filterOptions = useMemo(() => {
//     const options = [];

//     if (cardDataExpense.financialYear) {
//       const { year, start, end } = cardDataExpense.financialYear;
//       const startDate = new Date(start).toLocaleDateString();
//       const endDate = new Date(end).toLocaleDateString();
//       options.push({
//         label: (
//           <span className="text-sm">
//             Financial Year {year} ({startDate} - {endDate})
//           </span>
//         ),
//         value: "financialYear",
//       });
//     }

//     if (cardDataExpense.academicYear) {
//       const { year, start, end } = cardDataExpense.academicYear;
//       const startDate = new Date(start).toLocaleDateString();
//       const endDate = new Date(end).toLocaleDateString();
//       options.push({
//         label: (
//           <span className="text-sm">
//             Academic Year {year} ({startDate} - {endDate})
//           </span>
//         ),
//         value: "academicYear",
//       });
//     }

//     if (cardDataExpense.currentMonth) {
//       const { start, end } = cardDataExpense.currentMonth;
//       const startDate = new Date(start).toLocaleDateString();
//       const endDate = new Date(end).toLocaleDateString();
//       options.push({
//         label: (
//           <span className="text-sm">
//             Current Month ({startDate} - {endDate})
//           </span>
//         ),
//         value: "currentMonth",
//       });
//     }

//     if (cardDataExpense.today) {
//       const { start, end } = cardDataExpense.today;
//       const startDate = new Date(start).toLocaleDateString();
//       const endDate = new Date(end).toLocaleDateString();
//       options.push({
//         label: (
//           <span className="text-sm">
//             Today ({startDate} - {endDate})
//           </span>
//         ),
//         value: "today",
//       });
//     }

//     if (cardDataExpense.previousMonth) {
//       const { start, end } = cardDataExpense.previousMonth;
//       const startDate = new Date(start).toLocaleDateString();
//       const endDate = new Date(end).toLocaleDateString();
//       options.push({
//         label: (
//           <span className="text-sm">
//             Previous Month ({startDate} - {endDate})
//           </span>
//         ),
//         value: "previousMonth",
//       });
//     }

//     return options;
//   }, [cardDataExpense]);

//   const filteredData = useMemo(() => {
//     return cardDataExpense[selectedFilter] || {};
//   }, [cardDataExpense, selectedFilter]);

//   const expenseCards = useMemo(() => {
//     return [
//       {
//         title: "Total Expense",
//         value: filteredData.totalExpense
//           ? filteredData.totalExpense.toLocaleString("en-US", {
//               style: "currency",
//               currency: "QAR",
//             })
//           : "0.00 QAR",
//         comparison:
//           selectedFilter === "financialYear" &&
//           cardDataExpense.profitLossPercentage !== undefined
//             ? `Compared to last period (${cardDataExpense.profitLossPercentage}%)`
//             : "N/A",
//         percentage:
//           selectedFilter === "financialYear" &&
//           cardDataExpense.profitLossPercentage !== undefined
//             ? cardDataExpense.profitLossPercentage
//             : "N/A",
//         trend:
//           selectedFilter === "financialYear"
//             ? cardDataExpense.profitLossPercentage > 0
//               ? "up"
//               : cardDataExpense.profitLossPercentage < 0
//               ? "down"
//               : "N/A"
//             : "N/A",
//         icon: <FaDollarSign />, // Optional: Add relevant icons
//       },
//       {
//         title: "Total Paid",
//         value: filteredData.totalPaid
//           ? filteredData.totalPaid.toLocaleString("en-US", {
//               style: "currency",
//               currency: "QAR",
//             })
//           : "0.00 QAR",
//         comparison: "N/A",
//         percentage: "N/A",
//         trend: "N/A",
//         icon: <FaBuilding />, // Optional: Add relevant icons
//       },
//       {
//         title: "Outstanding Balances",
//         value: filteredData.totalRemainingBalance
//           ? filteredData.totalRemainingBalance.toLocaleString("en-US", {
//               style: "currency",
//               currency: "QAR",
//             })
//           : "0.00 QAR",
//         comparison: "N/A",
//         percentage: "N/A",
//         trend: "N/A",
//         icon: <FaBook />, // Optional: Add relevant icons
//       },
//       {
//         title: "Unpaid Expense",
//         value: filteredData.unpaidExpense
//           ? filteredData.unpaidExpense.toLocaleString("en-US", {
//               style: "currency",
//               currency: "QAR",
//             })
//           : "0.00 QAR",
//         comparison: "N/A",
//         percentage: "N/A",
//         trend: "N/A",
//         icon: <FaUniversity />, // Optional: Add relevant icons
//       },
//     ];
//   }, [filteredData, selectedFilter, cardDataExpense.profitLossPercentage]);

//   const handleFilterChange = (value) => {
//     setSelectedFilter(value);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <Spin size="large" tip="Loading cards..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <Alert message="Error loading cards." type="error" showIcon />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full mb-2">
//       <div className="flex justify-between items-center mb-2 space-x-4">
//         <Select
//           value={selectedFilter}
//           onChange={handleFilterChange}
//           options={filterOptions}
//           className="w-96"
//           size="middle"
//           placeholder="Select Time Frame"
//           optionLabelProp="label"
//           aria-label="Filter by time frame"
//           style={{
//             borderRadius: "0.375rem",
//             height: "40px",
//             borderColor: "#FF69B4", // Hot Pink border
//             boxShadow: "0 2px 4px rgba(255, 105, 180, 0.2)", // Pink shadow
//           }}
//           dropdownStyle={{ backgroundColor: "#fff", color: "#000" }}
//           suffixIcon={<FaFilter className="text-pink-500" />} // Pink filter icon
//         >
//           {filterOptions.map((option) => (
//             <Option
//               key={option.value}
//               value={option.value}
//               label={option.label}
//             >
//               {option.label}
//             </Option>
//           ))}
//         </Select>

//         <button
//           onClick={() => navigate("/finance/expenses/add")}
//           className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
//           aria-label="Add New Expense"
//         >
//           <span className="text-gray-800 font-medium">Add New Expense</span>
//           <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
//             <FaPlusCircle size={20} />
//           </div>
//         </button>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {expenseCards.map((card, index) => (
//           <Card
//             key={index}
//             title={card.title}
//             value={card.value}
//             percentage={card.percentage}
//             icon={card.icon}
//             trend={card.trend}
//             comparison={card.comparison}
//             compact // Assuming the Card component accepts a 'compact' prop to adjust styles
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CardSection;

import React, { useMemo } from "react";
import { Spin, Alert } from "antd";
import { FaDollarSign, FaBook, FaBuilding, FaUniversity } from "react-icons/fa";
import { useSelector } from "react-redux";
import Card from "../../StudentFees/Components/Card"; // Adjust the path if necessary
import { useNavigate } from "react-router-dom";

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
      <div className="flex justify-end items-center mb-4">
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {compactCardMapping}
      </div>
    </div>
  );
};

export default CardSection;
