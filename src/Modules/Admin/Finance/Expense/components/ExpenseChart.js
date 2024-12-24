// src/Modules/Admin/Finance/Components/ExpenseChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpenseChart = () => {
  const data = {
    labels: [
      "Salaries & Wages",
      "Utilities & Maintenance",
      "Supplies",
      "Event & Activity Expenses",
      "Library & Academic Resources",
      "IT and Software",
    ],
    datasets: [
      {
        label: "Amount",
        data: [10000, 3900, 6789, 8765, 2388, 5647],
        backgroundColor: [
          "#6366F1",
          "#FBBF24",
          "#34D399",
          "#F87171",
          "#60A5FA",
          "#A78BFA",
        ],
        borderRadius: 100, // Makes the top of the bars more rounded
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-96">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;
