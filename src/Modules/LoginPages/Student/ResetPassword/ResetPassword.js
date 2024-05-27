import React, { useState } from "react";
import Logo from "../../../../Components/Logo";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import useResetPassword from "../../../../Hooks/AuthHooks/Student/useResetPassword";
import { LuLoader } from "react-icons/lu";

const ResetPassword = () => {
  const [resetDetails, setResetDetails] = useState({
    newPassword: "",
    confirmPassword: "",
    studentId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, resetPassword } = useResetPassword();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword(resetDetails);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 p-6">
        <Logo />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center  w-full h-full"
      >
        <div className="bg-white p-8 rounded-lg w-full max-w-3xl">
          <h2 className="text-3xl  py-4 font-semibold">Reset Password </h2>

          <div className="mb-4">
            <input
              type="text"
              name="studentId"
              value={resetDetails.studentId}
              onChange={handleChange}
              placeholder="Student ID/ Addmission ID*"
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={resetDetails.newPassword}
                onChange={handleChange}
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
          <div className="mb-4">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={resetDetails.confirmPassword}
                onChange={handleChange}
                placeholder="Type your password"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEye /> : <PiEyeClosedFill />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            title="submit password"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            {loading ? (
              <div className="flex justify-center  ">
                <LuLoader className="animate-spin text-2xl" />
              </div>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
