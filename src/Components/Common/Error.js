import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex items-center space-x-8">
        {/* Left side: Icon and button */}
        <div className="flex flex-col items-center animate-fade-in-left">
          <FaExclamationCircle className="text-6xl text-gray-500 mb-4 animate-bounce-slow" />
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-md font-medium shadow-md hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none animate-pulse"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
        {/* Separator */}
        <div className="border-l-2 border-gray-400 h-24 animate-fade-in"></div>{" "}
        {/* Gray separator */}
        {/* Right side: 404 and message */}
        <div className="flex flex-col items-start animate-fade-in-right">
          <h1 className="text-4xl font-bold text-gray-800">404</h1>
          <p className="text-xl text-gray-600">Page Not Found</p>
          <p className="text-md text-gray-500 max-w-md mt-2">
            Sorry, the page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
