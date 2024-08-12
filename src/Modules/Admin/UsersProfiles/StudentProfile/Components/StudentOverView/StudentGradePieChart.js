import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { color } from "@cloudinary/url-gen/qualifiers/background";

const StudentGradePieChart = () => {
  const dataValues = [0, 0, 0, 0, 0, 0,0]; // Replace with your actual data values

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF",];

  const data = {
    labels: ["Bangla", "English", "Math", "Islam", "Accounting", "Arobi",],
    datasets: [
      {
        data: dataValues,
        backgroundColor: dataValues.map(value => value === 0 ? "gray" : colors[dataValues.indexOf(value)]), 
        hoverBackgroundColor: dataValues.map(value => value === 0 ? "gray" : colors[dataValues.indexOf(value)]),
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff", // White borders make segments distinct
      },
    ],
  };

  const options = {
    responsive: true,
    color:'gary',
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + "%";
          },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="flex-1 p-5 flex flex-row justify-start items-start">
      <Pie data={data} options={options} />
    </div>
  );
};

export default StudentGradePieChart;
