import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useSelector } from "react-redux";

const StudentGradePieChart = () => {
  const { studentSubjectProgress } = useSelector((s) => s.admin.all_students);

  /* ── Build data ────────────────────────────────────────── */
  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#FF9F40",
    "#4BC0C0",
    "#9966FF",
  ];

  const labels = Array.isArray(studentSubjectProgress)
    ? studentSubjectProgress.map((s) => s.subjectName || "Unknown")
    : [];

  const dataValues = Array.isArray(studentSubjectProgress)
    ? studentSubjectProgress.map((s) => parseFloat(s.percentageValue) || 0)
    : [];

  const hasData = dataValues.some((v) => v > 0);

  const pieData = hasData
    ? {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: dataValues.map((v, i) =>
              v === 0 ? "#d3d3d3" : COLORS[i % COLORS.length]
            ),
            borderWidth: 5,
            borderRadius: 10,
            borderColor: "#ffffff",
            cutout: "70%",
          },
        ],
      }
    : {
        labels: ["No Data"],
        datasets: [
          {
            data: [100],
            backgroundColor: "#d3d3d3",
            borderWidth: 5,
            borderRadius: 10,
            borderColor: "#ffffff",
            cutout: "70%",
          },
        ],
      };

  /* ── Same-size canvas options ──────────────────────────── */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // we’ll draw our own
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  /* ── Build custom legend items ─────────────────────────── */
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

export default StudentGradePieChart;
