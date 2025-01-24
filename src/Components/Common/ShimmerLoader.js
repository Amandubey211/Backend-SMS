import React from "react";

const ShimmerLoader = ({ width, height, className }) => {
  return (
    <div
      className={`bg-gray-300 rounded-md animate-pulse ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default ShimmerLoader;
