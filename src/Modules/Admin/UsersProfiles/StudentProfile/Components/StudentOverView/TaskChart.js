import React, { useEffect, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentTask } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useParams } from "react-router-dom";

const TaskChart = () => {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const { completedTask, inCompletedTask } = useSelector(
    (s) => s.admin.all_students
  );

  useEffect(() => {
    dispatch(fetchStudentTask({ id: cid }));
  }, [dispatch, cid]);

  const dataValues = [completedTask, inCompletedTask];
  const hasData = dataValues.some((v) => v > 0);

  /* ── Chart data ────────────────────────────────────────── */
  const pieData = hasData
    ? {
        labels: ["Completed", "Remaining"],
        datasets: [
          {
            data: dataValues,
            backgroundColor: ["#FF6384", "#FFCE56"],
            borderWidth: 5,
            borderRadius: 10,
            borderColor: "#ffffff",
            cutout: "70%",
          },
        ],
      }
    : {
        labels: ["No Progress"],
        datasets: [
          {
            data: [100],
            backgroundColor: "#4BC0C0",
            borderWidth: 5,
            borderRadius: 10,
            borderColor: "#ffffff",
            cutout: "70%",
          },
        ],
      };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // custom legend below
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  /* ── Legend items ─────────────────────────────────────── */
  const legendItems = useMemo(() => {
    const bg = pieData.datasets[0].backgroundColor;
    return pieData.labels.map((l, i) => ({
      label: l,
      color: Array.isArray(bg) ? bg[i] : bg,
    }));
  }, [pieData]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Chart */}
      <div className="relative w-56 h-56 md:w-60 md:h-60">
        <Pie data={pieData} options={options} />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {legendItems.map(({ label, color }, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskChart;
