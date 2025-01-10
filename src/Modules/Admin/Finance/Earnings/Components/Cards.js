import PropTypes from "prop-types";
import { Badge } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

// Define color classes for consistent styling
const colorClasses = {
  purple: {
    text: "text-purple-800",
    bg: "bg-purple-100",
    iconBg: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    iconBg: "bg-gradient-to-r from-yellow-400 to-yellow-300",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    iconBg: "bg-gradient-to-r from-red-500 to-red-400",
  },
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    iconBg: "bg-gradient-to-r from-green-500 to-green-400",
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    iconBg: "bg-gradient-to-r from-blue-500 to-blue-400",
  },
};

// Map titles to their respective text colors
const valueColorMapping = {
  "Total Revenue": "text-purple-800",
  "Total Remaining Balance": "text-red-600",
  "Total Paid": "text-green-600",
  "Total Advance": "text-blue-600",
};

const Card = ({
  title,
  dataPoints,
  comparison,
  percentage,
  icon,
  trend,
  color,
}) => {
  const isTrendUp = trend === "up";

  return (
    <div
      className={`p-2 px-4 w-full h-full rounded-lg border ${colorClasses[color]?.bg} hover:shadow-md hover:scale-105 transition-transform duration-200`}
      style={{
        background:
          "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
        borderColor: "#DABDFF",
      }}
    >
      {/* Title and Icon */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-800 truncate">{title}</h3>
        <div
          className={`p-2 rounded-md ${colorClasses[color]?.iconBg} text-white text-2xl`}
        >
          {icon}
        </div>
      </div>

      {/* Data Points */}
      <div className="space-y-1">
        {dataPoints.map((point, index) => (
          <div key={index} className="flex justify-between text-xs">
            <span className="font-medium text-gray-800">{point.title}</span>
            <span
              // className={`font-semibold ${
              //   valueColorMapping[point.title] || "text-gray-800"
              // }`}
              className={`font-semibold text-gray-800`}
            >
              {point.value}
            </span>
          </div>
        ))}
      </div>

      {/* Percentage and Trend (only for Current & Previous Month card) */}
      {percentage !== undefined && trend !== undefined && (
        <div className="flex justify-end items-center mt-2">
          <Badge
            count={`${percentage}%`}
            style={{
              backgroundColor: isTrendUp ? "#52c41a" : "#f5222d",
              marginRight: 4,
            }}
            overflowCount={999}
          />
          {isTrendUp ? (
            <ArrowUpOutlined style={{ color: "#52c41a" }} />
          ) : (
            <ArrowDownOutlined style={{ color: "#f5222d" }} />
          )}
        </div>
      )}

      {/* Comparison */}
      {comparison && (
        <p className={`text-xs ${colorClasses[color]?.text} mt-1 truncate`}>
          {comparison}
        </p>
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  dataPoints: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  comparison: PropTypes.string,
  percentage: PropTypes.number,
  trend: PropTypes.oneOf(["up", "down"]),
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

export default Card;
