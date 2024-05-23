import React from "react";
import { Doughnut } from "react-chartjs-2";

const TotalStudentsGraphjs = () => {
  const data = {
    datasets: [
      {
        data: [1200, 1800], // Values for the chart
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
    <div className="max-w-xs mx-auto  w-[80%] p-4">
      <h2 className="text-2xl font-semibold mb-4">Student</h2>
      <div
        className="relative"
        style={{ width: "300px", height: "300px", margin: "auto" }}
      >
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="block text-sm font-medium">Male Student</span>
            <span className="block text-xl font-bold">1200</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green-400"></span>
          <span>Male Students</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-purple-400"></span>
          <span>Female Students</span>
        </div>
      </div>
    </div>
  );
};

export default TotalStudentsGraphjs;
