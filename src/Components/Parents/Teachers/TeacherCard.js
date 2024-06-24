// src/components/StudentCard.js
import React from 'react';

const TeacherCards = ({ teacher }) => {
    return (
        <div className="relative w-64 h-70 rounded-md overflow-hidden hover:shadow-lg border border-gray-200 p-4 mr-4 ml-4 mt-1 mb-1 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 group ">
            <div className="flex flex-col items-center">
                <img className="w-24 h-24 rounded-full mb-6  border-purple-200" src={teacher.photo} alt={`${teacher.name}'s photo`} />
                <div className="w-full  border-gray-200 mb-4"></div>
                <div className="flex flex-col items-center mb-4">
                    <p className="text-gray-800 text-xl font-semibold mb-2">{teacher.name}</p>
                    <p className="text-gray-400">{teacher.role}</p>
                </div>
                <div className="w-full border-t border-gray-200 mb-4"></div>
                <span className='text-gray-400 font-light text-[15px]'>Phone</span>
                <div className="flex">
                
                    <button className=" text-gray-400 py-2 px-4 rounded ">
                       {teacher.phone}</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherCards;
