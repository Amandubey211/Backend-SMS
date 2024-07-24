import React from "react";
import { Bar } from "react-chartjs-2";

const TotalAttendanceGraph = () => {
  const data = {
    labels: ["One", "Two", "Three", "Four", "Five", "Six"],
    datasets: [
      {
        label: "Female",
        data: [300, 150, 350, 200, 250, 300],
        backgroundColor: "#8F77F3", // Updated Purple color
        borderRadius: 10, // Curved edges
        borderWidth: 1,
        stack: 'combined',
        barThickness: 30, // Explicitly set bar thickness
      },
      {
        label: "Male",
        data: [200, 100, 150, 100, 150, 200],
        backgroundColor: "#23C55E", // Updated Green color
        borderRadius: 10, // Curved edges
        borderWidth: 1,
        stack: 'combined',
        barThickness: 30, // Explicitly set bar thickness
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          stepSize: 100,
          max: 500,
        },
      },
      x: {
        stacked: true,
        barPercentage: 0.5, // Adjust category percentage to make bars thinner
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Todays Attendance</h2>
          <div className="text-3xl font-bold">2,500</div>
        </div>
        <div>
          <select className="border rounded p-2">
            <option>This month</option>
            <option>Last month</option>
          </select>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
      <div className="flex justify-around mt-4">
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1" style={{ alignSelf: 'flex-start' }}></div>
          <div className="flex items-center">
            <div className="text-gray-700">Total Female</div>
            <div className="ml-2 font-bold">1,500</div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1" style={{ alignSelf: 'flex-start' }}></div>
          <div className="flex items-center">
            <div className="text-gray-700">Total Male</div>
            <div className="ml-2 font-bold">1,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalAttendanceGraph;
