// src/components/StudentCard.js
import React from 'react';

const ChildCard = ({ student }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4">
        <div className="flex flex-col items-center">
            <img className="w-16 h-16 rounded-full mb-4" src={student.photo} alt={student.name} />
            <div className="flex flex-wrap justify-center space-x-4 mb-4">
                <p className="text-gray-600">Class: {student.class}</p>
                <p className="text-gray-600">ID: {student.id}</p>
                <p className="text-gray-600">Section: {student.section}</p>
                <p className="text-gray-600">Group: {student.group}</p>
            </div>
            <div className="flex space-x-4 mb-4">
                <button className="bg-purple-200 text-purple-800 py-1 px-3 rounded">Teachers</button>
                <button className="bg-purple-200 text-purple-800 py-1 px-3 rounded">Grades</button>
                <button className="bg-purple-200 text-purple-800 py-1 px-3 rounded">Attendance</button>
            </div>
            <div>
                <button className="bg-green-200 text-green-800 py-2 px-4 rounded">Check Subject Progress</button>
            </div>
        </div>
    </div>
    );
};

export default ChildCard;
