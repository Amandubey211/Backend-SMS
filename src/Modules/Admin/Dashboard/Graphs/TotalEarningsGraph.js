import React from "react";
import { Line } from "react-chartjs-2";

const TotalEarningsGraph = () => {
  const data = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Total Collections",
        data: [300000, 250000, 200000, 300000, 250000, 200000, 150000],
        backgroundColor: "rgba(124, 58, 237, 0.2)",
        borderColor: "rgba(124, 58, 237, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Fees Collection",
        data: [200000, 150000, 51749, 180000, 220000, 170000, 200000],
        backgroundColor: "rgba(234, 88, 12, 0.2)",
        borderColor: "rgba(234, 88, 12, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${
              context.dataset.label
            }: ${context.raw.toLocaleString()} QR`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + " QR";
          },
        },
      },
    },
  };
  return (
    <div className="p-4">
      <div className="bg-white p-1">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Earnings</h2>
            <div className="text-2xl font-bold">500,000 QR</div>
          </div>
          <div>
            <select className="border rounded p-2">
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
        </div>
        <Line data={data} options={options} />
        <div className="flex justify-around mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 mr-2"></div>
            <div>Total Collections</div>
            <div className="ml-2 font-bold">45,000</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
            <div>Fees Collection</div>
            <div className="ml-2 font-bold">25,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalEarningsGraph;
