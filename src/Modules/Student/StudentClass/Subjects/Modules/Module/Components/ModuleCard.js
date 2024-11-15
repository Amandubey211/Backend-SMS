import React from "react";

const ModuleCard = ({
  title,
  moduleNumber,
  imageUrl,
  isCompleted,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`relative mb-4 border ${isSelected ? "border-2 border-rose-400" : ""
        } bg-white rounded-lg cursor-pointer`}
      onClick={onSelect}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-32 object-cover rounded-t-lg" // Reduced height of the image
      />
      <div className="p-3"> {/* Reduced padding here */}
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex justify-between items-center mt-1"> {/* Reduced margin */}
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-3"> {/* Adjusted padding */}
            <span className="text-gradient">Module {moduleNumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
