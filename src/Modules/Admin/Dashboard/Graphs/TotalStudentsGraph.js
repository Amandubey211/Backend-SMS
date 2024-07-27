import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { BsThreeDots } from "react-icons/bs";
import useGetAdminDashboardData from "../../../../Hooks/AuthHooks/Staff/Admin/Dashboard/useGetAdminDashboardData";
import Fallback from "../../../../Components/Common/Fallback";

const TotalStudentsGraphjs = () => {
  const { loading, error, dashboardData, fetchAdminDashboardData } = useGetAdminDashboardData();

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!dashboardData) {
    return null;
  }

  const { maleStudents, femaleStudents } = dashboardData;

  const data = {
    datasets: [
      {
        data: [maleStudents, femaleStudents], // Dynamic values for the chart
        backgroundColor: ["#23C55E", "#8F77F3"], // Colors for the segments
        borderWidth: 0,
        cutout: "70%",
        borderRadius: 10,
        spacing: 5, // Reduce space between segments
        hoverOffset: 10, // Increase segment size on hover
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
    hover: {
      mode: "nearest",
      intersect: true,
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
      <div className="flex justify-around mt-4 text-lg">
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1"></div>
          <div className="text-left">
            <span className="text-gray-700">Female Students</span>
            <div className="font-bold text-gray-700">{femaleStudents}</div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1"></div>
          <div className="text-left">
            <span className="text-gray-700">Male Students</span>
            <div className="font-bold text-gray-700">{maleStudents}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalStudentsGraphjs;
