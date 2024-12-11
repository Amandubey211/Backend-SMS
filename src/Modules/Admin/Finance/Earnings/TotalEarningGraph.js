// src/Modules/Admin/Finance/Earnings/TotalEarningGraph.js
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const TotalEarningGraph = () => {
  const [selectedMonth, setSelectedMonth] = useState("By Month");

  // Handle dropdown selection
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    console.log(`Selected month: ${event.target.value}`);
  };

  // Data for the chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Revenue",
        data: [5000, 10000, 15000, 20000, 15000, 10000, 5000, 10000, 15000, 20000, 15000, 10000],
        fill: true,
        backgroundColor: "rgba(72, 191, 145, 0.2)", // Gradient background color
        borderColor: "rgba(72, 191, 145, 1)", // Green border color
        pointBackgroundColor: "#D940C7", // Points color
        pointBorderColor: "#fff", // Point border color
        tension: 0.4, // Smooth line
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#D940C7",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: "rgba(0,0,0,0.1)", // Dashed vertical grid lines
          borderDash: [5, 5],
        },
        ticks: {
          color: "#666", // Month label color
        },
      },
      y: {
        grid: {
          color: "#eee", // Horizontal grid lines
        },
        ticks: {
          color: "#666", // Y-axis label color
        },
      },
    },
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Custom Legend and Dropdown */}
        <div className="flex items-end gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              
            ></div>
            <span className="text-gray-700 text-sm font-medium"></span>
          </div>
        </div>

        {/* Month Dropdown */}
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="px-6 py-2 bg-white text-gray-700 font-medium text-sm border rounded-md hover:shadow-md transition focus:outline-none"
          style={{
            borderImageSource: "linear-gradient(to right, #C83B62, #46138A)",
            borderImageSlice: 1,
            borderWidth: "2px",
            borderRadius: "8px",
          }}
        >
          <option value="By Month">By Month</option>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
            (month) => (
              <option key={month} value={month}>
                {month}
              </option>
            )
          )}
        </select>
      </div>

      {/* Graph */}
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalEarningGraph;
 
