import React from "react";
import { Bar } from "react-chartjs-2";

const TotalAttendanceGraph = () => {
  const data = {
    labels: ["One", "Two", "Three", "Four", "Five", "Six"],
    datasets: [
      {
        label: "Female",
        data: [300, 150, 350, 200, 250, 300],
        backgroundColor: "rgba(124, 58, 237, 0.5)", // Purple color
        borderColor: "rgba(124, 58, 237, 1)",
        borderWidth: 1,
      },
      {
        label: "Male",
        data: [200, 100, 150, 100, 150, 200],
        backgroundColor: "rgba(34, 197, 94, 0.5)", // Green color
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="bg-white  ">
      <div className="bg-white rounded-lg  p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Today's Attendance</h2>
            <div className="text-2xl font-bold">2,500</div>
          </div>
          <div>
            <select className="border rounded p-2">
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
        </div>
        <Bar data={data} options={options} />
        <div className="flex justify-around mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 mr-2"></div>
            <div>Total Female</div>
            <div className="ml-2 font-bold">1,500</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <div>Total Male</div>
            <div className="ml-2 font-bold">1,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalAttendanceGraph;
