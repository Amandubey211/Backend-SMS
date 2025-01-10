import React from "react";

const StatusBadge = ({ status }) => {
  const statusColors = {
    Paid: "bg-green-100 text-green-600",
    Unpaid: "bg-red-100 text-red-600",
    Overdue: "bg-yellow-100 text-yellow-600",
  };

  return <span className={`px-2 py-1 rounded-lg font-medium ${statusColors[status]}`}>{status}</span>;
};

export default StatusBadge;
