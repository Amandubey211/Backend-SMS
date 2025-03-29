// ./Components/Test/CrashTest.jsx
import React from "react";

const CrashTest = () => {
  // Force an error on render
  throw new Error("Test error from CrashTest component!");
  // return <div>Won't be reached</div>;
};

export default CrashTest;
