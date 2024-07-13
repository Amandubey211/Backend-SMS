


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
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = () => {
  const data = {
    labels: ['Completed Tasks', 'Missing Tasks'],
    datasets: [
      {
        data: [75, 25], // Example data: 75% completed, 25% missing
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%',
    plugins: {
      legend: {
        display: true, // Hide the legend

        position: 'bottom',
        
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return ` ${percentage}% (${value})`;
          },
        },
      },
    },
    // Example: Setting specific width and height
    // layout: {
    //   padding: {
    //     left: 3,
    //     right: 3,
    //     top: 0,
    //     bottom: 0,
    //   },
    // },
  };

  return (
    // <div className="w-full max-w-2xl h-96 mx-auto p-5  ">
    <div className=" flex-1 px-20 py-6  flex flex-row justify-start items-start  border  " >
        <Doughnut data={data} options={options} />
      </div>   
  );
};

export default TaskCompletionChart;
