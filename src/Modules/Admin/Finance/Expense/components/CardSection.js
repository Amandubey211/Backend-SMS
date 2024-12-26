// src/Modules/Admin/Finance/Components/CardSection.js
import React from "react";
import Card from "../../StudentFees/Components/Card";

const CardSection = () => {
  const cardData = [
    {
      title: "Total Expenses",
      value: "2,67,634 QAR",
      comparison: "Compared to (2,34,567 QAR last month)",
      percentage: 3.5,
      trend: "up",
    },
    {
      title: "Most Expensive Category",
      value: "Salaries and Wages",
      comparison: "Compared to (2,34,567 QAR last month)",
      percentage: 3.5,
      trend: "up",
    },
    {
      title: "Outstanding Balances",
      value: "2,67,634 QAR",
      comparison: "Compared to (2,34,567 QAR last month)",
      percentage: -3.5,
      trend: "down",
    },
    {
      title: "Total Expenses",
      value: "2,67,634 QAR",
      comparison: "Compared to (2,34,567 QAR last month)",
      percentage: 3.5,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 auto-rows-fr">
      {cardData.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default CardSection;
