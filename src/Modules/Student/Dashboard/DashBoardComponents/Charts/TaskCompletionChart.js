
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { GoAlertFill } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {fetchStudentTask} from "../../../../../Store/Slices/Admin/Users/Students/student.action"
Chart.register(ArcElement, Tooltip, Legend);
const TaskCompletionChart = () => {
    const {completedTask,inCompletedTask} = useSelector((store) => store.admin.all_students);
    console.log('---1',completedTask);
    const {userDetails} = useSelector((store) => store.common.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudentTask({id:userDetails?.userId}))
  }, [dispatch])

    const data = {
        datasets: [
            {
               
                data: [completedTask,inCompletedTask],
                backgroundColor: [
                    'pink', 
                    'orange'  
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(200, 200, 200, 1)'
                ],
                borderWidth: 1,
                cutout: '70%'
            },
            
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
            <div className=" flex-1 p-5 flex flex-col justify-start items-start h-[17rem] mb-10 ">
              <div className='flex flex-row gap-10 mb-2'>
              <p className='text-gray-500'>Completed <spna className='text-pink-600 font-bold'>{completedTask}%</spna></p>
              <p className='text-gray-500'>Remaining <spna className='text-yellow-700 font-bold'>{inCompletedTask}%</spna></p>
              </div>
              <Doughnut data={data} options={options} />
            </div>
</>
    );
};

export default TaskCompletionChart;
