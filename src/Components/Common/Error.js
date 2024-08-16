import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <div className="text-white flex flex-col justify-center items-center ">
        <FaExclamationTriangle className="text-9xl  mb-3" />
        <h1 className="text-9xl font-extrabold animate-pulse">404</h1>
        <p className="text-2xl mt-4 animate-fade-in-up">Page Not Found</p>
        <p className="text-lg mt-2 animate-fade-in-up delay-1s">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>
      <button
        className="mt-10 px-6 py-3 bg-white text-purple-700 font-semibold rounded-md shadow-lg hover:bg-purple-700 hover:text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default Error;
