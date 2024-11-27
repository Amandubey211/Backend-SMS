import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Logo from "../../../../Components/Common/Logo";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import { LuLoader } from "react-icons/lu";
import Layout from "../../../../Components/Common/Layout";
import { useForgotPassword, useResetPassword } from "../../../../Hooks/CommonHooks/useResetPassword";

const ResetPassword = () => {
  const [resetDetails, setResetDetails] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
    token: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading,  } = useForgotPassword();
  const {  resetPassword } = useResetPassword();
  const location = useLocation();

  useEffect(() => {
    const urlParts = location.pathname.split('/');
    const token = urlParts[urlParts.length - 1];
    setResetDetails(prev => ({ ...prev, token }));
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resetDetails.newPassword !== resetDetails.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    resetPassword(resetDetails);
  };

  return (
    <Layout title="Reset Password">
      <div className="relative w-full h-full">
        <div className="absolute top-0 right-0 p-6">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center w-full h-full">
          <div className="bg-white p-8 rounded-lg w-full max-w-3xl">
            <NavLink to="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2">
              <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
                &larr;
              </div>
              <span>LMS Home</span>
            </NavLink>
            <h2 className="text-3xl py-4 font-semibold">Reset Password</h2>

            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={resetDetails.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
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
                  placeholder="Confirm your password"
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
                <div className="flex justify-center">
                  <LuLoader className="animate-spin text-2xl" />
                </div>
              ) : (
                "Reset"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;
