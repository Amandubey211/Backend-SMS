import React from "react";

const Card = ({ title, count, color, textColor }) => {
  return (
    <div    className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
    style={{
      background:
        "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
      borderColor: "#DABDFF",
    }}>
      <h3 className="text-sm font-medium text-gray-800 truncate">{title} Amount</h3>
      <p className={`text-xl font-bold  text-purple-800 `}>{count?.toFixed(2)} QAR</p>
    </div>
  );
};

export default Card;
