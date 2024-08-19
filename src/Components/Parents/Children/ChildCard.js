import React from 'react';
import { useNavigate } from "react-router-dom";

const ChildCard = ({ student }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white shadow-xl backdrop-blur-md border-[1px] rounded-lg p-6 m-4">
            <div className="flex flex-col items-center">
                {/* Profile image centered at the top */}
                <img className="w-16 h-16 rounded-full mb-4" src={student.profile} alt={student.name} />
            
                <p className="font-semibold uppercase mb-4">{student.name}</p>

                {/* Additional student details */}
                <div className="flex flex-col items-center justify-center mb-4 space-y-2">
                    <p className="text-gray-600 uppercase">Class: <span className="">{student.class}</span></p>
                    <p className="text-gray-600 ">ID: <span className="">{student.admissionNumber}</span></p>
                    <p className="text-gray-600 uppercase">Section: <span className="">{student.section}</span></p>
                    <p className="text-gray-600 uppercase">Group: <span className="">{student.group}</span></p>
                </div>

                {/* Navigation buttons */}
                <div className="flex space-x-4 mb-4">
                    <button className="bg-purple-200 text-purple-800 py-2 px-4 rounded uppercase" onClick={() => navigate("/teacher")}>Teachers</button>
                    <button className="bg-purple-200 text-purple-800 py-2 px-4 rounded uppercase" onClick={() => navigate(`/childgrade/${student.id}`)}>Grades</button>
                    <button className="bg-purple-200 text-purple-800 py-2 px-4 rounded uppercase" onClick={() => navigate("/attendance")}>Attendance</button>
                </div>
                <div>
                    <button className="bg-green-200 text-green-800 py-2 px-4 rounded uppercase" onClick={() => navigate(`/checkprogress/${student.id}`)}>Check Subject Progress</button>
                </div>
            </div>
        </div>
    );
};

export default ChildCard;
