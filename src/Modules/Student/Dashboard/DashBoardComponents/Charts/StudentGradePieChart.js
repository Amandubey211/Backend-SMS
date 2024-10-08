import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const StudentGradePieChart = ({ gradesData }) => {
  // Define the labels and calculate data points
  const labels = [
    "Assignments",
    "Quizzes",
    "Group Assignments",
    "Group Quizzes",
    "Submitted Group Assignments",
    "Submitted Group Quizzes",
  ];

  const dataPoints = [
    gradesData?.totalScoreOfAllAssignments || 0,
    gradesData?.totalScoreOfAllQuizzes || 0,
    gradesData?.totalGroupAssignmentScore || 0,
    gradesData?.totalGroupQuizScore || 0,
    gradesData?.submittedGroupAssignmentScore || 0,
    gradesData?.submittedGroupQuizScore || 0,
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataPoints,
        backgroundColor: [
          "#FF6384",  // Assignments
          "#36A2EB",  // Quizzes
          "#FFCE56",  // Group Assignments
          "#FF9F40",  // Group Quizzes
          "#4BC0C0",  // Submitted Group Assignments
          "#9966FF",  // Submitted Group Quizzes
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false, // Disable built-in legend to avoid duplication
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center mb-1">
      <div style={{ width: "300px", height: "300px" }}>
        <Pie data={data} options={options} />
      </div>
      {/* Custom Legend with Separate Div for Circles */}
      <div className="flex flex-wrap justify-between w-full max-w-[400px]">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center mb-4 w-[calc(33%-10px)] min-w-[120px]">
            <div
              className="flex-shrink-0 mr-3"
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: data.datasets[0].backgroundColor[index],
                borderRadius: '50%',
              }}
            ></div>
            <div className="flex-grow">
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGradePieChart;
