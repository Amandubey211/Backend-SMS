import { Line } from 'react-chartjs-2';
import React from 'react';

// Helper function to get the number of days in a month
const getDaysInMonth = (month, year) => {
  // Create a new date object for the given year and month, and return the number of days in that month
  return new Date(year, month + 1, 0).getDate();
};

const AttendanceChart = ({ data }) => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Array of month names to be used as labels on the x-axis
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate the number of days in each month for the current year
  const daysInMonths = months.map((_, index) => getDaysInMonth(index, currentYear));

  // Find the maximum attendance value from the API data to dynamically adjust y-axis
  const maxAttendance = Math.max(
    ...data.flatMap((month) => [month.present || 0, month.absent || 0, month.leave || 0])
  );

  // Determine the suggested maximum value for y-axis, ensuring it's slightly above the maximum attendance value
  const suggestedMax = maxAttendance <= 5 ? 5 : maxAttendance + 2;

  // Prepare the data for the chart
  const chartData = {
    labels: months, // Labels for each month of the year
    datasets: [
      {
        label: 'Present',
        data: data.map((month) => month.present || 0), // Get the 'present' value for each month, default to 0 if not available
        backgroundColor: 'rgba(75, 192, 75, 0.6)', // Green color for the 'Present' line (symbolizing success or good status)
        borderColor: 'rgba(75, 192, 75, 1)',
        borderWidth: 2,
        fill: false, // No area fill under the line
      },
      {
        label: 'Absent',
        data: data.map((month) => month.absent || 0), // Get the 'absent' value for each month, default to 0 if not available
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red color for the 'Absent' line (commonly used for errors or warnings)
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false, // No area fill under the line
      },
      {
        label: 'Leave',
        data: data.map((month) => month.leave || 0), // Get the 'leave' value for each month, default to 0 if not available
        backgroundColor: 'rgba(255, 159, 64, 0.6)', // Orange color for the 'Leave' line (representing a neutral status)
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        fill: false, // No area fill under the line
      },
    ],
  };

  // Configuration options for the chart
  const options = {
    responsive: true, // Make the chart responsive to screen size
    plugins: {
      legend: {
        position: 'top', // Position the legend at the top of the chart
      },
      title: {
        display: true, // Display the chart title
        text: 'Monthly Attendance', // Title text for the chart
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start the y-axis at zero
        suggestedMax: suggestedMax, // Set a suggested maximum value slightly above the maximum attendance value
        ticks: {
          stepSize: 1, // Set the step size for the y-axis ticks to better reflect smaller data ranges
          callback: function (value) {
            // Format the tick labels to show 'Days'
            return value + ' Days';
          },
        },
      },
    },
  };

  return (
    <div className="attendance-chart">
      {/* Render the Line chart with the provided data and options */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AttendanceChart;