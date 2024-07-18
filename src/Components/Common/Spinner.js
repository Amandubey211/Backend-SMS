import React from "react";
import { ImSpinner3 } from "react-icons/im";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  );
};

export default Spinner;
