import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useSelector } from "react-redux";

const StudentGradePieChart = () => {
  const { studentSubjectProgress } = useSelector((store) => store.admin.all_students);

  // Debugging: Log the data to inspect its structure
  console.log("studentSubjectProgress:", studentSubjectProgress);

  // Validate and extract subject names and percentage values
  const labels = Array.isArray(studentSubjectProgress)
    ? studentSubjectProgress.map((subject) => subject.subjectName || "Unknown")
    : [];
  const dataValues = Array.isArray(studentSubjectProgress)
    ? studentSubjectProgress.map((subject) => parseFloat(subject.percentageValue) || 0)
    : [];


  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF"];

  // Check if all data values are 0 or if there's no data
  const allZero = dataValues.length === 0 || dataValues.every((value) => value === 0);

  // Default data for when there's no data or all values are 0
  const defaultData = {
    labels: ["No Data"],
    datasets: [
      {
        data: [100],
        backgroundColor: "#d3d3d3", // Gray for no data
        hoverBackgroundColor: "#d3d3d3",
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff",
        cutout: "70%",
      },
    ],
  };

  // Data for the pie chart when there is valid data
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: dataValues.map((value, index) =>
          value === 0 ? "#d3d3d3" : colors[index % colors.length]
        ),
        hoverBackgroundColor: dataValues.map((value, index) =>
          value === 0 ? "#d3d3d3" : colors[index % colors.length]
        ),
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff",
        cutout: "70%",
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to resize freely
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
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[18rem] flex flex-col justify-start items-center">
      <div className="relative w-full h-[14rem]">
        <Pie data={allZero ? defaultData : data} options={options} />
      </div>
    </div>
  );
};

export default StudentGradePieChart;