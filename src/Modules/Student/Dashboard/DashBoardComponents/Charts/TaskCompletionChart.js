


// //--------------------------------

// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// Chart.register(ArcElement, Tooltip, Legend);

// const TaskChart = ({ totalTasks = 12, completedTasks = 5 }) => {
//     const completedPercentage = Math.round((completedTasks / totalTasks) * 100);
//     const missingPercentage = 100 - completedPercentage;

//     const data = {
//         labels: ['Completed Task', 'Missing Task'],
//         datasets: [
//             {
//                 data: [completedPercentage, missingPercentage],
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.6)', // Pink for completed
//                     'rgba(200, 200, 200, 0.6)'  // Grey for missing
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(200, 200, 200, 1)'
//                 ],
//                 borderWidth: 1,
//                 cutout: '70%'
//             }
//         ]
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(tooltipItem) {
//                         return `${tooltipItem.label}: ${tooltipItem.raw}%`;
//                     }
//                 }
//             }
//         },
//         maintainAspectRatio: false
//     };

//     return (
//         <div className=" flex-1 p-5 flex flex-row justify-start items-start ">

//             <Doughnut data={data} options={options} />
//             </div>

//     );
// };

// export default TaskChart;

import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = () => {
  const data = {
    labels: ["Completed Task", "Incomplete Task"],
    datasets: [
      {
        data: [67,21], // Percentage or total points for each subject
        backgroundColor: [
          
          "#7B61FF",
          "#FFD700",
        ],
        hoverBackgroundColor: [
          
          "#7B61FF",
          "#FFD700",
        ],
        borderWidth: 5,
        
        borderRadius: 10,
        borderColor: "#ffffff", // White borders make segments distinct
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 8,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + "%";
          },
        },
      },
    },
  };

  return (
    <div className="flex-1 flex justify-center items-center h-full">
      <div style={{ width: "290px", height: "290px" , marginTop:"10px"}}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskCompletionChart;
