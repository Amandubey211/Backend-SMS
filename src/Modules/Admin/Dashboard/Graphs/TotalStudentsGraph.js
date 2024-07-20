import React from "react";
import { Doughnut } from "react-chartjs-2";
import { BsThreeDots } from "react-icons/bs";

const TotalStudentsGraphjs = ({ maleStudents, femaleStudents }) => {
  const data = {
    datasets: [
      {
        data: [maleStudents, femaleStudents], // Dynamic values for the chart
        backgroundColor: ["#8F77F3", "#23C55E"], // Colors for the segments
        borderWidth: 1,
      },
    ],
    labels: ["Male Students", "Female Students"],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="max-w-xs px-2 py-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Total Student</h2>
        <BsThreeDots />
      </div>
      <div className="relative p-8 my-5 mb-12" style={{ width: "300px", height: "300px" }}>
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="block text-sm font-medium">Total Students</span>
            <span className="block text-xl font-bold">{maleStudents + femaleStudents}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-around text-sm">
        <div className="flex flex-col items-start">
          <span className="inline-block w-10 h-1 mb-1 bg-[#8F77F3]"></span>
          <span className="text-xs text-gray-500">Male Students</span>
          <span className="text-lg font-bold">{maleStudents}</span>
        </div>
        <div className="border-r h-14"></div>
        <div className="flex flex-col items-start">
          <span className="inline-block w-10 h-1 mb-1 bg-[#23C55E]"></span>
          <span className="text-xs text-gray-500">Female Students</span>
          <span className="text-lg font-bold">{femaleStudents}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalStudentsGraphjs;
