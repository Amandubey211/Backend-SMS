import React from "react";

const Card = ({ title, count, color, textColor, customContent }) => {
  return (
    <div className={`rounded-lg p-6 shadow-md ${color}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {/* <p className="text-sm text-gray-600">(all categories)</p> */}
      {customContent ? (
        <div className="mt-4">{customContent}</div>
      ) : (
        <p className={`mt-4 text-3xl font-semibold ${textColor}`}>
          {count} <span className="text-lg">Quotation</span>
        </p>
      )}
    </div>
  );
};

export default Card;
