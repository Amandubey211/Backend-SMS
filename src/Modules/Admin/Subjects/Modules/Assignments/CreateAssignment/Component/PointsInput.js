// PointsInput.jsx
import React, { forwardRef } from "react";

const PointsInput = forwardRef(({ id, points, handleChange, error }, ref) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      Points
    </label>
    <input
      id={id}
      ref={ref}
      type="number"
      name="points"
      value={points}
      onChange={handleChange}
      className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

PointsInput.displayName = "PointsInput";

export default PointsInput;
