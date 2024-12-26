// src/Modules/Admin/Finance/Earnings/Cards.js
import React from "react";
import PropTypes from "prop-types";

const Card = ({ title, value, comparison, percentage, icon, trend }) => {
  const isTrendUp = trend === "up";

  // Trend-specific styles
  const trendStyles = isTrendUp
    ? { boxColor: "E8FFEE", textColor: "06A72E", icon: "▲" }
    : { boxColor: "FFECEB", textColor: "E70F00", icon: "▼" };

  return (
    <div
      className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
      style={{
        background:
          "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
        borderColor: "#DABDFF",
      }}
    >
      {/* Title and Icon */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-800 truncate">{title}</h3>
      </div>

      {/* Value and Trend */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-purple-800 truncate">
          {value}
        </h2>
        <div
          className="flex items-center gap-1 text-xs md:text-sm rounded-md px-2 py-1"
          style={{
            backgroundColor: `#${trendStyles.boxColor}`,
            color: `#${trendStyles.textColor}`,
          }}
        >
          <span>{percentage}%</span>
          <span>{trendStyles.icon}</span>
        </div>
      </div>

      {/* Comparison */}
      <p className="text-xs text-gray-500 mt-2 truncate">{comparison}</p>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  comparison: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  trend: PropTypes.oneOf(["up", "down"]).isRequired,
};

export default Card;
