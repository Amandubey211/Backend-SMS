import React, { useState, useEffect } from "react";
import Logo from "../../../../../Components/Common/Logo";
import { LuLoader } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "../../../../../Components/Common/Layout";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useForgotPassword } from "../../../../../Hooks/CommonHooks/useResetPassword";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0); // timer in seconds
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { loading, sendForgotPassword } = useForgotPassword();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state; // 'student' or 'parent'

  const normalizedRole = role === "" ? "staff" : role;

  // On mount, check localStorage for an existing timer end time based on role.
  useEffect(() => {
    const timerEndKey = `forgetPasswordTimerEnd_${normalizedRole}`;
    console.log('timerEndKey', timerEndKey)
    const timerEnd = localStorage.getItem(timerEndKey);

    if (timerEnd) {
      const remaining = Math.ceil((parseInt(timerEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        setHasSubmitted(true);
      } else {
        localStorage.removeItem(timerEndKey);
      }
    }
  }, [normalizedRole]); // Re-run this effect when the role changes.

  // Countdown effect: decrement timer every second until it reaches 0.
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const timerEndKey = `forgetPasswordTimerEnd_${normalizedRole}`;
          localStorage.removeItem(timerEndKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, normalizedRole]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendForgotPassword({ email, role });
      setHasSubmitted(true);
      // Start a 60-second countdown after successful submission.
      setTimer(60);
      const timerEndKey = `forgetPasswordTimerEnd_${normalizedRole}`;
      localStorage.setItem(timerEndKey, Date.now() + 60000);
      // Optionally, if you want to navigate immediately after submission, uncomment:
      // navigate("/");
    } catch (error) {
      // Optionally, handle errors here.
      // toast.error(error.msg || "Failed to reset password.");
    }
  };

  // Determine button label
  let buttonLabel = "Submit";
  if (loading) {
    buttonLabel = (
      <div className="flex justify-center">
        <LuLoader className="animate-spin text-2xl" />
      </div>
    );
  } else if (timer > 0) {
    buttonLabel = `Resend after ${timer} seconds`;
  } else if (hasSubmitted) {
    buttonLabel = "Resubmit";
  }

  return (
    <Layout title="Forget Password">
      <div className="relative w-full h-screen flex justify-center items-center">
        <div className="absolute top-0 right-0 p-6">
          <Logo />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center w-full h-full"
        >
          <div className="bg-white p-8 rounded-lg w-full max-w-3xl">
            <NavLink
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
            >
              <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
                &larr;
              </div>
              <span>LMS Home</span>
            </NavLink>
            <h2 className="text-3xl py-4 font-semibold">Forget Password</h2>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || timer > 0}
              className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md ${timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:from-pink-600 hover:to-purple-600"
                }`}
            >
              {buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
