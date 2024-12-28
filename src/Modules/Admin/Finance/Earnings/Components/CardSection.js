// src/Modules/Admin/Finance/Earnings/Components/CardSection.jsx

import React, { useState, useMemo } from "react";
import { Select, Spin, Alert } from "antd";
import { useSelector } from "react-redux";
import {
  FaDollarSign,
  FaBook,
  FaBuilding,
  FaUniversity,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa";
import Card from "./Cards"; // Ensure Cards.jsx handles the 'compact' prop
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CardSection = () => {
  // State variable for selected filter
  const [selectedFilter, setSelectedFilter] = useState("financialYear");

  // Access cardDataRevenue, loading, and error from Redux store
  const { cardDataRevenue, loading, error } = useSelector(
    (state) => state.admin.earnings
  );

  const navigate = useNavigate();

  // Define available filters with dynamic labels based on cardDataRevenue data
  const filterOptions = useMemo(() => {
    const options = [];

    if (cardDataRevenue.financialYear) {
      const { year, start, end } = cardDataRevenue.financialYear;
      const startDate = new Date(start).toLocaleDateString();
      const endDate = new Date(end).toLocaleDateString();
      options.push({
        label: (
          <span className="text-sm">
            Financial Year {year} ({startDate} - {endDate})
          </span>
        ),
        value: "financialYear",
      });
    }

    if (cardDataRevenue.academicYear) {
      const { year, start, end } = cardDataRevenue.academicYear;
      const startDate = new Date(start).toLocaleDateString();
      const endDate = new Date(end).toLocaleDateString();
      options.push({
        label: (
          <span className="text-sm">
            Academic Year {year} ({startDate} - {endDate})
          </span>
        ),
        value: "academicYear",
      });
    }

    if (cardDataRevenue.currentMonth) {
      const { year, start, end } = cardDataRevenue.currentMonth;
      const startDate = new Date(start).toLocaleDateString();
      const endDate = new Date(end).toLocaleDateString();
      options.push({
        label: (
          <span className="text-sm">
            Current Month ({startDate} - {endDate})
          </span>
        ),
        value: "currentMonth",
      });
    }

    if (cardDataRevenue.today) {
      const { start, end } = cardDataRevenue.today;
      const startDate = new Date(start).toLocaleDateString();
      const endDate = new Date(end).toLocaleDateString();
      options.push({
        label: (
          <span className="text-sm">
            Today ({startDate} - {endDate})
          </span>
        ),
        value: "today",
      });
    }

    // Optionally include 'previousMonth' if needed
    if (cardDataRevenue.previousMonth) {
      const { start, end } = cardDataRevenue.previousMonth;
      const startDate = new Date(start).toLocaleDateString();
      const endDate = new Date(end).toLocaleDateString();
      options.push({
        label: (
          <span className="text-sm">
            Previous Month ({startDate} - {endDate})
          </span>
        ),
        value: "previousMonth",
      });
    }

    return options;
  }, [cardDataRevenue]);

  // Extract cardDataRevenue based on selected filter
  const filteredData = useMemo(() => {
    return cardDataRevenue[selectedFilter] || {};
  }, [cardDataRevenue, selectedFilter]);

  // Define the card configurations
  const earningCards = useMemo(() => {
    return [
      {
        title: "Total Revenue",
        value: filteredData.totalRevenue?.toFixed(2) || "0.00",
        percentage:
          selectedFilter === "financialYear"
            ? cardDataRevenue.profitLossPercentage?.toFixed(2) || "0.00"
            : "N/A",
        icon: <FaDollarSign />,
        trend:
          selectedFilter === "financialYear"
            ? cardDataRevenue.profitLossPercentage >= 0
              ? "up"
              : "down"
            : "N/A",
        comparison:
          selectedFilter === "financialYear"
            ? cardDataRevenue.profitLossPercentage >= 0
              ? "Increased compared to last period"
              : "Decreased compared to last period"
            : "N/A",
      },
      {
        title: "Remaining Balance",
        value: filteredData.totalRemainingBalance?.toFixed(2) || "0.00",
        percentage: "N/A", // No percentage change available
        icon: <FaBook />,
        trend: "N/A", // No trend data available
        comparison: "Unpaid fees are pending",
      },
      {
        title: "Total Paid",
        value: filteredData.totalPaid?.toFixed(2) || "0.00",
        percentage: "N/A", // No percentage change available
        icon: <FaBuilding />,
        trend: "N/A", // No trend data available
        comparison: "Partial payments remain",
      },
      {
        title: "Total Advance",
        value: filteredData.totalAdvance?.toFixed(2) || "0.00",
        percentage: "N/A", // No percentage change available
        icon: <FaUniversity />,
        trend: "N/A", // No trend data available
        comparison: "Advance payments recorded",
      },
    ];
  }, [filteredData, selectedFilter, cardDataRevenue.profitLossPercentage]);

  // Handle filter change
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  // Handle "Add New Earning" button click
  const handleAddNewEarning = () => {
    navigate("/finance/earning/add");
  };

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
      {/* Top Row: Select Filter and "Add New Earning" Button */}
      <div className="flex justify-between items-center mb-2 space-x-4">
        {/* Enhanced Select Box */}
        <Select
          value={selectedFilter}
          onChange={handleFilterChange}
          options={filterOptions}
          className="w-96"
          size="middle"
          placeholder="Select Time Frame"
          optionLabelProp="label"
          aria-label="Filter by time frame"
          style={{
            borderRadius: "0.375rem",
            height: "40px",
            borderColor: "#FF69B4", // Hot Pink border
            boxShadow: "0 2px 4px rgba(255, 105, 180, 0.2)", // Pink shadow
          }}
          dropdownStyle={{ backgroundColor: "#fff", color: "#000" }}
          suffixIcon={<FaFilter className="text-pink-500" />} // Pink filter icon
        >
          {filterOptions.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              label={option.label}
            >
              {option.label}
            </Option>
          ))}
        </Select>

        {/* "Add New Earning" Button */}
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {earningCards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={`${card.value} QAR`}
            percentage={card.percentage}
            icon={card.icon}
            trend={card.trend}
            comparison={card.comparison}
            compact // Assuming the Card component accepts a 'compact' prop to adjust styles
          />
        ))}
      </div>
    </div>
  );
};

export default CardSection;
