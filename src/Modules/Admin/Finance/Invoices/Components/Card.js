import React from "react";

const Card = ({ title, count, color, textColor }) => {
  return (
    <div className={`rounded-lg p-6 ${color}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mb-2">(all categories)</p>
      <p className={`text-3xl font-semibold ${textColor}`}>{count} invoices</p>
    </div>
  );
};

export default Card;
