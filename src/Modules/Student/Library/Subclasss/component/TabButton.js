// TabButton.js
import React from 'react';

const TabButton = ({ isActive, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`h-12 inline-flex justify-center text-center items-center px-12 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-black ${
                isActive ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600" : "bg-white"
            }`}
        >
            {children}
        </button>
    );
};

export default TabButton;
