import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(3); // Countdown for redirection
  const { loading, resetPassword } = useResetPassword();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParts = location.pathname.split('/');
    const token = urlParts[urlParts?.length - 1];
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

    resetPassword(resetDetails)
      .then(() => {
        // Successfully reset the password
        setIsModalOpen(true);
        let timer = 3;
        const interval = setInterval(() => {
          if (timer === 0) {
            clearInterval(interval);
            navigate("/studentlogin"); // Redirect to login page after countdown
          } else {
            setCountdown(timer);
            timer -= 1;
          }
        }, 1000);
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
              {/* Close Button */}
              <button
                onClick={() => navigate("/studentlogin")}
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                aria-label="Close Modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="text-center">
                {/* Success Icon */}
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                {/* Title */}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Password Changed Successfully!
                </h3>

                {/* Countdown Text */}
                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    You will be redirected in {countdown}...
                  </p>
                </div>

                {/* Close Button */}
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/studentlogin")}
                    className="px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResetPassword;
