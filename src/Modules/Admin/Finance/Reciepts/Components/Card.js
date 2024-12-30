import React from "react";

const Card = ({ title, count, color, textColor, customContent, tag, icon }) => {
  return (
    <div
      className={`rounded-lg p-6 shadow-md border cursor-pointer hover:shadow-lg transform transition-transform duration-300 hover:scale-105`}
      style={{
        background:
          "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
        borderColor: "#DABDFF",
      }}
    >
      <div className="flex items-center">
        <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold px-2">{title}</h3>
      </div>
      {customContent ? (
        <div className="mt-4">{customContent}</div>
      ) : (
        <div className="mt-4">
          <p className="text-2xl font-bold text-purple-800">
            {count}{" "}
            <span
              className={`${
                tag === "receipts" || tag === "receipt"
                  ? "text-xs"
                  : "text-purple-800"
              }`}
            >
              {tag === "receipts" || tag === "receipt"
                ? count > 1
                  ? "receipts"
                  : "receipt"
                : tag}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Card;
