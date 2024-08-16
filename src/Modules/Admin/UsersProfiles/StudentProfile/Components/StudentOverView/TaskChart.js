


//--------------------------------

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { GoAlertFill } from 'react-icons/go';
Chart.register(ArcElement, Tooltip, Legend);

const TaskChart = ({ totalTasks = 100, completedTasks = 0 }) => {
    const completedPercentage = Math.round((completedTasks / totalTasks) * 100);
    const missingPercentage = 100 - completedPercentage;

    const data = {
        datasets: [
            {
                data: [completedPercentage, missingPercentage],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', // Pink for completed
                    'rgba(200, 200, 200, 0.6)'  // Grey for missing
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(200, 200, 200, 1)'
                ],
                borderWidth: 1,
                cutout: '70%'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <>
       {completedTasks == 0 ?<div className="flex w-full h-full text-gray-500  items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        No  Data Found
        </div>:
        <div className=" flex-1 p-5 flex flex-col justify-start items-start h-[15rem] ">
   
              <Doughnut data={data} options={options} />
            </div>}
</>
    );
};

export default TaskChart;
