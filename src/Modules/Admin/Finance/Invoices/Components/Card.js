import React from "react";

const Card = ({ title, count, color, textColor }) => {
  return (
    <div className={`rounded-lg p-6 ${color}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={`text-xl font-semibold ${textColor}`}>{count?.toFixed(2)} QAR</p>
    </div>
  );
};

export default Card;
