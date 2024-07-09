import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setStep } from "../../../../Redux/Slices/AuthSlice";

const Navigation = () => {
  const step = useSelector((store) => store.Auth.step);
  const dispatch = useDispatch();
  return (
    <div className="flex justify-between items-center px-1">
      {step === 1 && (
        <NavLink
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
        >
          <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
            &larr;
          </div>
          <span>LMS Home</span>
        </NavLink>
      )}

      {step === 2 && (
        <NavLink
          // to="/"
          onClick={() => dispatch(setStep(1))}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
        >
          <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
            &larr;
          </div>
          <span>Back</span>
        </NavLink>
      )}
      <span className="opacity-75 text-xs text-red-600">
        ( * ) indicates Required
      </span>
    </div>
  );
};

export default Navigation;
