import React, { useState } from "react";
import useMoveModule from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useMoveModule";

const MoveModule = ({ moduleId, currentPosition, modulesData, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(currentPosition);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { moveModule, loading } = useMoveModule();

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  const handleMove = async () => {
    if (selectedIndex === currentPosition) {
      return; // Do nothing if the selected index is the same as the current position
    }

    setIsSubmitting(true);
    await moveModule(moduleId, selectedIndex);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 transition-transform duration-300 ease-out transform scale-100">
      <div className="w-full mb-4">
        <label
          htmlFor="indexSelect"
          className="block text-xl font-semibold text-gray-700 mb-4 text-center"
        >
          Select New Position
        </label>
        <div className="space-y-2">
          {modulesData?.modules.map((_, index) => (
            <div
              key={index}
              onClick={() => handleIndexChange(index)}
              className={`flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer transition-transform duration-200 ease-in-out transform hover:translate-x-2 ${
                index === currentPosition
                  ? "bg-gray-300 text-gray-800 font-bold"
                  : index === selectedIndex
                  ? "bg-purple-200 text-purple-700"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <span>{`Position ${index + 1}`}</span>
              {index === currentPosition && (
                <span className="text-sm text-gray-600">(Current)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleMove}
        disabled={loading || isSubmitting || selectedIndex === currentPosition}
        className="w-full my-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 transform transition-transform duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || isSubmitting ? "Please Wait..." : "Move Module"}
      </button>
    </div>
  );
};

export default MoveModule;
