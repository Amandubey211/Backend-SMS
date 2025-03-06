import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentTask } from "../../../../../Store/Slices/Admin/Users/Students/student.action";

Chart.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = () => {
  const { completedTask, inCompletedTask } = useSelector(
    (store) => store.admin.all_students
  );
  const { userDetails } = useSelector((store) => store.common.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentTask({ id: userDetails?.userId }));
  }, [dispatch]);

  const data = {
    datasets: [
      {
        data: [completedTask || 0, inCompletedTask || 0],
        backgroundColor: ["#7C3AED", "#E9D5FF"], // 🔹 Updated with better contrast
        cutout: "70%", // 🔹 Keeps the inner circle cut out for a modern look
        borderRadius: 10,
        spacing: 1,
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
    // labels: ["Remaining", "Completed"],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: true,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom", // 🔹 Move legend below the chart
        labels: {
          color: "#ffffff", // 🔹 Light text for contrast
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)", // 🔹 Dark tooltip for better visibility
        bodyFont: {
          size: 14,
        },
      },
    },
  };
  return (
    <div className="flex flex-col items-center w-full">
      {/* Chart and Summary */}
      <div className="flex flex-col items-center justify-center ">
        {/* Task Summary */}
        <div className="flex flex-row justify-between w-full mb-3 px-9 text-sm">
          <p className="text-gray-500  text-left w-[40%]">
            Completed{" "}
            <span className="text-purple-500 font-bold">
              {Number(completedTask).toFixed(2)}%
            </span>
          </p>
          <p className="text-gray-500 text-right w-[35%]">
            Remaining{" "}
            <span className="text-gray-700 font-bold ">
              {Number(inCompletedTask).toFixed(2)}%
            </span>
          </p>
        </div>

        {/* Chart */}
        <div className="h-[145px]">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionChart;
