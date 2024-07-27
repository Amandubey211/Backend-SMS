import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ title, lastEdit }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        <button onClick={handleBackClick} className="text-xl mr-3">
          <FaArrowLeft />
        </button>
        <div className="ml-3">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-gray-600">
            Last Edit: {new Date(lastEdit).toLocaleDateString() || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
