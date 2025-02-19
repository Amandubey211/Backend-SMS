// Components/StaffLoginForm.js
import React, { useState } from "react";
import Logo from "../../../Components/Common/Logo";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import { LuLoader } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { staffLogin } from "../../../Store/Slices/Common/Auth/Index"; // Ensure the path to the file is correct
import { IoIosArrowRoundBack } from "react-icons/io";

const StaffLoginForm = () => {
  const [staffCredentials, setStaffCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isShaking, setIsShaking] = useState(false); // Shake animation state
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.common.auth);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update credentials and clear error when typing
    setStaffCredentials((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));

    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Reset shake state after animation
  };

  const validateForm = () => {
    const newErrors = {};
    if (!staffCredentials.email.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!staffCredentials.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors)?.length > 0) {
      triggerShake();
    }

    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateForm()) {
      return;
    }

    // Dispatch the staffLogin thunk with credentials
    dispatch(staffLogin(staffCredentials))
      .unwrap()
      .then((result) => {
        // Success logic, check if there's a redirect path
        if (result.redirect) {
          navigate(result.redirect, { replace: true });
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle error, clear the password field
        setStaffCredentials((prevDetails) => ({
          ...prevDetails,
          password: "",
        }));
      });
  };

  return (
    <div className="relative h-full bg-gray-100 w-full">
      <div className="absolute top-0 right-0 p-6">
        <Logo />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="bg-white border p-8 rounded-lg w-full max-w-md">
          <NavLink
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
          >
            <div className="rounded-full border-2 text-xl w-6 h-6 flex justify-center items-center">
              <IoIosArrowRoundBack />
            </div>
            <span>LMS Home</span>
          </NavLink>
          <h2 className="text-2xl font-semibold mb-6">Staff Account</h2>
          <form
            onSubmit={handleSubmit}
            className={isShaking ? "animate-shake" : ""} // Add Tailwind animation class
          >
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={staffCredentials.email}
                onChange={handleInputChange}
                placeholder="Type your email"
                className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                aria-required="true"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={staffCredentials.password}
                  onChange={handleInputChange}
                  placeholder="Type your password"
                  className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <PiEyeClosedFill />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mb-6 text-right">
              <NavLink
                to="/forget_password"
                state={{ role: "" }}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Forgot password
              </NavLink>
            </div>
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center">
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

export default StaffLoginForm;
