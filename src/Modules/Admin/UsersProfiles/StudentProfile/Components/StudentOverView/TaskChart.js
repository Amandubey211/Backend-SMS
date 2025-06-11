import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentTask } from '../../../../../../Store/Slices/Admin/Users/Students/student.action';
import { useParams } from 'react-router-dom';

const TaskChart = () => {
    const { cid } = useParams();
    const { completedTask, inCompletedTask } = useSelector((store) => store.admin.all_students);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStudentTask({ id: cid }));
    }, [dispatch, cid]);

    // Define labels and data
    const labels = ['Completed', 'Remaining'];
    const dataValues = [completedTask, inCompletedTask];

    // Define colors
    const colors = ['#FF6384', '#FFCE56']; // Pink for completed, yellow for remaining

    // Check if all data values are 0
    const allZero = dataValues.every((value) => value === 0);

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: allZero
                    ? Array(dataValues.length).fill('gray')
                    : colors,
                hoverBackgroundColor: allZero
                    ? Array(dataValues.length).fill('gray')
                    : colors,
                borderWidth: 5,
                borderRadius: 10,
                borderColor: '#ffffff',
                cutout: '70%',
            },
        ],
    };

    const emptyData = {
        labels: ['No Progress'],
        datasets: [
            {
                data: [100],
                backgroundColor: '#4BC0C0',
                hoverBackgroundColor: '#4BC0C0',
                borderWidth: 5,
                borderRadius: 10,
                borderColor: '#ffffff',
                cutout: '70%',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to resize freely
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-[18rem] flex flex-col justify-start items-center">
            <div className="relative w-full h-[14rem]">
                <Pie data={allZero ? emptyData : data} options={allZero ? {} : options} />
            </div>
        </div>
    );
};

export default TaskChart;