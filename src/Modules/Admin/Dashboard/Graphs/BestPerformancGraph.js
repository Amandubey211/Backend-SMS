import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const BestPerformersChart = ({ data }) => {
  const options = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const chartData = {
    labels: data.map((item) => item.class),
    datasets: data.map((item) => ({
      label: item.subject,
      data: [item.percentage],
      backgroundColor: item.color,
      barThickness: 30,
    })),
  };

  return (
    <div
      className="max-w-4xl mx-auto p-2   shadow-md"
      style={{ width: "500px", height: "350px", margin: "auto" }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold">Best Performers</h2>
        <select className="border border-gray-300 rounded-md p-2">
          <option>Week</option>
          <option>Month</option>
        </select>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BestPerformersChart;
