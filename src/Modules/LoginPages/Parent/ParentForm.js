import React, { useState } from "react";
import Logo from "../../../Components/Common/Logo";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { parentLogin } from "../../../Store/Slices/Common/Auth/actions/parentActions";
import { IoIosArrowRoundBack } from "react-icons/io";

const ParentForm = () => {
  const [parentDetails, setParentDetails] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isShaking, setIsShaking] = useState(false); // State for triggering shake animation

  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.common.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update the input value and clear the error
    setParentDetails((prev) => ({
      ...prev,
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
    if (!parentDetails.email.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!parentDetails.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);

    // Trigger shake animation if there are errors
    if (Object.keys(newErrors).length > 0) {
      triggerShake();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateForm()) {
      return;
    }

    // Dispatch login action
    dispatch(parentLogin({ parentDetails, navigate }))
      .unwrap()
      .then((result) => {
        if (result) {
          navigate("/parent_dash");
        }
      })
      .catch((error) => {
        console.error(error);
        // Clear password on error
        setParentDetails((prev) => ({
          ...prev,
          password: "",
        }));
      });
  };

  return (
    <div className="relative h-full bg-gray-100 overflow-y-auto w-full">
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
          <h2 className="text-2xl font-semibold mb-6">Parent Account</h2>
          <form
            onSubmit={handleSubmit}
            className={isShaking ? "animate-shake" : ""} // Apply Tailwind shake animation
          >
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={parentDetails.email}
                onChange={handleInputChange}
                placeholder="Type your email"
                className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={parentDetails.password}
                  onChange={handleInputChange}
                  placeholder="Type your password"
                  className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
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
                state={{ role: "parent" }}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Forgot Password
              </NavLink>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
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

export default ParentForm;
