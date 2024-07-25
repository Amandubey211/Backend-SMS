import React from "react";

const ModuleCard = ({ title, moduleNumber, imageUrl, isCompleted, isSelected, onSelect }) => {
  return (
    <div
      className={`relative mb-4 border ${isSelected ? "border-2 border-rose-400" : ""} bg-white rounded-lg cursor-pointer`}
      onClick={onSelect}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            <span className="text-gradient">Module {moduleNumber}</span>
          </p>
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <span className="text-green-500">Completed</span>
            ) : (
              <span className="text-gray-500">In Progress</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
