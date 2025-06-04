import React from "react";

const AssignmentDetail = React.memo(({ label, value, extra }) => {
  const displayValue = value ?? "Unlimited";

  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center">
        <p className="text-md font-semibold text-gray-900">{displayValue}</p>
        {extra && (
          <p className="text-md font-semibold text-gray-500 ml-1">{extra}</p>
        )}
      </div>
    </div>
  );
});

export default AssignmentDetail;
