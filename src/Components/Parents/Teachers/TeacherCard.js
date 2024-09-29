import React from 'react';

const TeacherCard = ({ instructor }) => {
    return (
        <div className="relative w-full md:w-64 h-auto rounded-lg overflow-hidden shadow-md border border-gray-200 p-6 m-2 mr-5 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white">
            <div className="w-full flex flex-col items-center">
                {/* Black border with some spacing */}
                <div className="relative w-28 h-28 rounded-full border-2 border-gray overflow-hidden mt-2 mb-3 flex items-center justify-center">
                    <img 
                        className="w-full h-full object-cover rounded-full p-1" // Ensures the image is circular inside the border
                        src={instructor.image || 'https://avatars.githubusercontent.com/u/109097090?v=4'} 
                        alt={`${instructor.name}'s photo`}
                        onError={(e) => e.currentTarget.src = 'https://avatars.githubusercontent.com/u/109097090?v=4'} // Fallback image
                    />
                </div>
                
                <div className="text-center">
                    <p className="text-gray-900 text-lg font-semibold mb-1">{instructor?.name || 'undefined undefined'}</p>
                    <p className="text-gray-500 font-medium text-sm">{instructor?.role || 'Instructor'}</p>
                </div>
                
                <div className="w-full border-t mt-4 pt-2 flex flex-col items-center">
                    <span className="text-gray-500 font-semibold text-sm">Phone</span>
                    <span className="text-gray-900 text-md mt-1">{instructor?.phone || '+974 65456485'}</span> {/* Sample Phone */}
                </div>
            </div>
        </div>
    );
};

export default TeacherCard;
