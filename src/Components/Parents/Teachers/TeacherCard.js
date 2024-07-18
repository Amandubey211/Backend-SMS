// src/components/TeacherCard.js
import React from 'react';

const TeacherCard = ({ instructors }) => {
    return (
        <div className="relative w-96 h-70 rounded-lg overflow-hidden shadow-md border border-gray-200 p-4 m-2 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white">
            <div className="w-full flex flex-col items-center">
            <img 
  className="w-24 h-24 rounded-full mt-4 mb-3" 
  src="https://avatars.githubusercontent.com/u/109097090?v=4" 
  alt={`${instructors.name}'s photo`}
  onError={(e) => e.currentTarget.src = 'https://avatars.githubusercontent.com/u/109097090?v=4'} // Fallback image
/>


                <div className="text-center">
                    <p className="text-gray-900 text-lg font-semibold">{instructors.name}</p>
                    <p className="text-gray-500 font-semibold text-sm">{instructors.role}</p>
                    <p className="text-gray-500 font-semibold text-sm">{instructors.department}</p>


                </div>
                <div className="flex flex-col items-center mt-3 mb-2">
                    <span className="text-gray-700 text-sm">Phone:</span>
                    <span className="text-gray-500 font-semibold text-sm">{instructors.phone}</span>
                    <span className="text-gray-500 font-semibold text-sm">{instructors.email}</span>
                </div>
            </div>
            
        </div>
    );
};

export default TeacherCard;
