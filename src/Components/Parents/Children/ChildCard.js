// src/components/StudentCard.js
import React from 'react';
import { useNavigate } from "react-router-dom";
const ChildCard = ({ student }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4">
        <div className="flex flex-col items-center">
        <div style={{ display: 'flex', alignItems: 'center' }}>
  <img className="w-16 h-16 rounded-full mb-4" src={student.photo} alt={student.name} />
  <div style={{ marginLeft: '10px' }}>
    <p className="text-gray-600 mb-1">Name:</p>
    <p className="font-semibold">{student.name}</p>
  </div>
</div>

            <div className="flex flex-wrap justify-center space-x-4 mb-4">
                <p className="text-gray-600">Class: {student.class}</p>
                <p className="text-gray-600">ID: {student.id}</p>
                <p className="text-gray-600">Section: {student.section}</p>
                <p className="text-gray-600">Group: {student.group}</p>
            </div>
            <div className="flex space-x-4 mb-4">
                <button className="bg-purple-200 text-purple-800 py-1 px-3 rounded" onClick={()=> navigate("/teacher")}>Teachers</button>
                <button className="bg-purple-200 text-purple-800 py-1 px-3 rounded" onClick={()=> navigate("/childgrade")}>Grades</button>
                <button className="bg-purple-200 text-purple-800 py-1 px-3 rounded" onClick={()=> navigate("/attendance")}>Attendance</button>
            </div>
            <div>
                <button className="bg-green-200 text-green-800 py-2 px-4 rounded" onClick={()=> navigate("/checkprogress")}>Check Subject Progress</button>
            </div>
        </div>
    </div>
    );
};

export default ChildCard;
