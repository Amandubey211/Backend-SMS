import React from "react";
import PropTypes from "prop-types";

const Card = ({ title, count, icon }) => {

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
          {count}
        </h2>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  trend: PropTypes.oneOf(["up", "down"]).isRequired,
};

export default Card;
