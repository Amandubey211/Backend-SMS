import { Bar } from 'react-chartjs-2';
import React from 'react';

// Helper function to get the number of days in a month
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const AttendanceChart = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const daysInMonths = months.map((_, index) => getDaysInMonth(index, currentYear));

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Present',
        data: data.map((month, index) => month.present || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Absent',
        data: data.map((month, index) => month.absent || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Leave',
        data: data.map((month, index) => month.leave || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Attendance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...daysInMonths),
        ticks: {
          stepSize: 10,
          callback: function(value, index, values) {
            const lastTickValue = values[values.length - 1].value;
            if (value === lastTickValue && lastTickValue % 10 !== 0) {
              return value + " Days";
            }
            return value % 10 === 0 ? value + " Days" : null;
          }
        },
      },
    },
  };

  return (
    <div className="attendance-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AttendanceChart;
