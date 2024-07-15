import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { TbBorderRadius } from "react-icons/tb";

const StudentGradePieChart = () => {
  const data = {
    labels: ["Bangla", "English", "Math", "Islam", "Accounting", "Arobi"],
    datasets: [
      {
        data: [15, 20, 30, 10, 20, 5], // Percentage or total points for each subject
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff", // White borders make segments distinct
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
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
    <>

      {/* <div className="  p-5 flex  "> */}
      <div className=" flex-1 px-20 py-6 flex flex-row justify-start items-start border ">
      {/* <span className="text-sm font-medium ">Student Grade</span> */}

        <Pie data={data} options={options} />
      </div>
    </>
  );
};

export default StudentGradePieChart;
