import React from "react";

const Card = ({ title, count, color, textColor,icon }) => {
  return (
    <div    className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
    style={{
      background:
        "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
      borderColor: "#DABDFF",
    }}>
       <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-800 truncate">{title} Amount</h3>
      </div>
      <p className={`text-xl font-bold  text-purple-800 px-2 `}>{count?.toFixed(2)} QAR</p>
    </div>
  );
};

export default Card;
