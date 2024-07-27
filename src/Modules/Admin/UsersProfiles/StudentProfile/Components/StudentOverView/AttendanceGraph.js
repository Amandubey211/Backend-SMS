import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { TbBorderRadius } from "react-icons/tb";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";
import { useParams } from "react-router-dom";
Chart.register(...registerables);

const AttendanceGraph = () => {
  let data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Present",
        data: [0, 0, 0, 0, 0,0,0,0,0,0,0,0 ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Absent",
        data: [0, 0, 0, 0, 0,0,0,0,0,0,0,0 ],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Leave",
        data: [0, 0, 0, 0, 0,0,0,0,0,0,0,0],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
  };
  const {cid} = useParams()
  const role = useSelector((store) => store.Auth.role);

    const fetchAttendance = async (month, year) => {
        try {
            const token = localStorage.getItem(`${role}:token`)
            if (!token) {
                throw new Error('Authentication not found');
            }

            const response = await axios.get(`${baseUrl}/api/teacher/attendance/studentAttendance?startDate=2000-05-10&endDate=2024-06-10&studentId=${cid}`, {
                
                headers: {
                    'Authentication': token
                }
            })
        
            console.log(response?.data.report.report);
            response?.data.report.report.forEach((e) => {
             let a = e.date.slice(5,7);
             if(e.status == 'absent'){
              data.datasets[1].data[a] =data.datasets[1].data[a]+1
             }
             if(e.status == 'present'){
              data.datasets[0].data[a] =data.datasets[0].data[a]+1
             }
             if(e.status == 'leave'){
              data.datasets[2].data[a] =data.datasets[2].data[a]+1
             }
              console.log(a);
            });

        } catch (error) {
            console.error("Failed to fetch Attendance:", error);
        }
    }
useEffect(()=>{
  fetchAttendance()
},[])
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} QR`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false, // This will hide the grid lines for the y-axis
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false, // This will hide the grid lines for the x-axis
        },
      },
    },
  };
  
  return (
       
        
          <Line data={data} options={options}  className=" " />
  );
};

export default AttendanceGraph;
