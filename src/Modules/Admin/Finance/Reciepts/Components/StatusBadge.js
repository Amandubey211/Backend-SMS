import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: { backgroundColor: "#DCFFE5", color: "#088728" },
    Unpaid: { backgroundColor: "#FFE6E5", color: "#E70F00" },
    Partial: { backgroundColor: "#FFF0E3", color: "#FF6E0D" },
    Overdue: { backgroundColor: "#FFE6E5", color: "#E53935" },
  };

  return (
    <span
      className="px-3 py-2 rounded-lg text-sm font-semibold"
      style={styles[status] || { backgroundColor: "#E0E0E0", color: "#808080" }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
