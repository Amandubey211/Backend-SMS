import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useSelector } from "react-redux";

const StudentGradePieChart = () => {
  const { studentSubjectProgress } = useSelector((store) => store.admin.all_students);

  // Extract subject names and percentage values
  const labels = studentSubjectProgress?.map((subject) => subject.subjectName) || [];
  const dataValues = studentSubjectProgress?.map((subject) => subject.percentageValue) || [];

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF"];

  // Check if all data values are 0
  const allZero = dataValues?.every((value) => value === 0);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: allZero
          ? Array(dataValues?.length).fill("gray")
          : dataValues?.map((value) =>
            value === 0 ? "gray" : colors[dataValues.indexOf(value) % colors?.length]
          ),
        hoverBackgroundColor: allZero
          ? Array(dataValues?.length).fill("gray")
          : dataValues?.map((value) =>
            value === 0 ? "gray" : colors[dataValues.indexOf(value) % colors?.length]
          ),
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff",
        cutout: "70%",
      },
    ],
  };

  const Edata = {
    labels: ["Progress is 0%"],
    datasets: [
      {
        data: [100],
        backgroundColor: "#4BC0C0",
        hoverBackgroundColor: "#4BC0C0",
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
        <Pie data={allZero ? Edata : data} options={allZero ? {} : options} />
      </div>
    </div>
  );
};

export default StudentGradePieChart;