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
        data: [completedTask, inCompletedTask],
        backgroundColor: ["pink", "rgba(150, 150, 150, 1)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(200, 200, 200, 1)"],
        borderWidth: 1,
        cutout: "70%", // Keeps the inner circle cut out
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    maintainAspectRatio: false, // Ensures it stretches to fill container
  };

  return (
    <div className="flex flex-col items-center p-5">
      {/* Title */}
      <div className="w-full flex justify-start mb-4">
        {/* <h2 className="text-xl font-bold text-gray-700">Task</h2> */}
      </div>

      {/* Chart and Summary */}
      <div className="flex flex-col items-center justify-center h-[18rem] w-[18rem]">
        {/* Task Summary */}
        <div className="flex flex-row justify-between w-full mb-5 text-lg">
          <p className="text-gray-500">
            Completed{" "}
            <span className="text-pink-600 font-bold text-lg">
              {completedTask}%
            </span>
          </p>
          <p className="text-gray-500">
            Remaining{" "}
            <span className="text-gray-700 font-bold text-lg">
              {inCompletedTask}%
            </span>
          </p>
        </div>

        {/* Chart */}
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskCompletionChart;
