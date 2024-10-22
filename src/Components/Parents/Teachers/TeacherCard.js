import React, { memo } from 'react';
import { useTranslation } from "react-i18next";

const TeacherCard = ({ instructor }) => {
    const { t } = useTranslation('prtNotices');

    return (
        <div className="relative w-full md:w-64 h-auto rounded-lg overflow-hidden shadow-md border border-gray-200 p-6 m-2 mr-5 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white">
            <div className="w-full flex flex-col items-center">
                {/* Black border with some spacing */}
                <div className="relative w-28 h-28 rounded-full border-2 border-gray overflow-hidden mt-2 mb-3 flex items-center justify-center">
                    <img
                        className="w-full h-full object-cover rounded-full p-1"
                        src={instructor?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                        alt={`${instructor?.name || 'Instructor'}'s photo`}
                        loading="lazy" // Lazy load the image for performance
                        onError={(e) => e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} // Fallback image
                    />
                </div>

                <div className="text-center">
                    <p className="text-gray-900 text-lg font-semibold mb-1">{instructor?.name || 'N/A'}</p>
                    <p className="text-gray-500 font-medium text-sm">{instructor?.department || 'N/A'}</p>
                </div>

                <div className="w-full border-t mt-4 pt-2 flex flex-col items-center">
                    <span className="text-gray-500 font-semibold text-sm">Phone</span>
                    <span className="text-gray-900 text-md mt-1">{instructor?.phone || 'N/A'}</span> {/* Sample Phone */}
                </div>
            </div>
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
export default memo(TeacherCard);
