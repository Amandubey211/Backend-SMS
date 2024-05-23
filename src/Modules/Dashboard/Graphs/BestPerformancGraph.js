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
      className="max-w-4xl mx-auto p-7 "
      style={{ width: "500px", height: "500px", margin: "auto" }}
    >
      <h2>Best Performance</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BestPerformersChart;
