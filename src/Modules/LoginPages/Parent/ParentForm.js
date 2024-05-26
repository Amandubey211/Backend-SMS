import React, { useState } from "react";
import Logo from "../../../Components/Logo";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import toast from "react-hot-toast";
import useParentLogin from "../../../Hooks/AuthHooks/Parent/useParentLogin";
import { LuLoader } from "react-icons/lu";
const ParentForm = () => {
  const [ParentDetails, setParentDetails] = useState({
    Email: "",
    Password: "",
  });
  const { loading, login } = useParentLogin();
  const HandleSubmit = (e) => {
    e.preventDefault();
    if (!ParentDetails) return toast.error("please add the required details");
    login(ParentDetails);
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative h-full bg-gray-100 w-full">
      <div className="absolute top-0 right-0 p-6">
        <Logo />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="bg-white border p-8 rounded-lg w-full max-w-md">
          <NavLink
            to="/"
            className="text-sm  text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
          >
            <div className="rounded-full border-2 text-xl w-6 h-6 flex justify-center items-center">
              &larr;
            </div>
            <span>LMS Home</span>
          </NavLink>
          <h2 className="text-2xl font-semibold mb-6">Parent Account</h2>
          <form onSubmit={HandleSubmit}>
            <h6>Login in using:</h6>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={ParentDetails.Email}
                onChange={(e) =>
                  setParentDetails((prev) => ({
                    ...prev,
                    Email: e.target.value,
                  }))
                }
                placeholder="  Type your email"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={ParentDetails.Password}
                  onChange={(e) =>
                    setParentDetails((prev) => ({
                      ...prev,
                      Password: e.target.value,
                    }))
                  }
                  placeholder="Type your password"
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEye /> : <PiEyeClosedFill />}
                </button>
              </div>
            </div>
            <div className="mb-6 text-right">
              <NavLink
                to="/forgetpassword"
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Forgot Password
              </NavLink>
            </div>
            <button
              onClick={HandleSubmit}
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            >
              {loading ? (
                <div className="flex justify-center  ">
                  <LuLoader className="animate-spin text-2xl" />
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParentForm;
