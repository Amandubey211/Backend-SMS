import React, { useState } from "react";
import Logo from "../../../../Components/Common/Logo";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import toast from "react-hot-toast";
import useQidVerification from "../../../../Hooks/AuthHooks/Student/useQIDVerify";
import { LuLoader } from "react-icons/lu";

const QIDLogin = () => {
  const [StudentID, setStudentID] = useState({
    Q_Id: "",
    addmissionNumber: "",
  });
  const { loading, verify } = useQidVerification();
  const [showPassword, setShowPassword] = useState(false);
  const HandleSubmit = (e) => {
    e.preventDefault();
    if (!StudentID) return toast.error("please add the required details");
    verify(StudentID);
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
            <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
              &larr;
            </div>
            <span>LMS Home</span>
          </NavLink>
          <div className="flex justify-between items-center  mb-6">
            <h2 className="text-2xl font-semibold">QID Verification</h2>
          </div>
          <form onSubmit={HandleSubmit}>
            <h6>Verify using:</h6>
            <div className="mb-4">
              <input
                type="text"
                id="studentQID"
                value={StudentID.addmissionNumber}
                onChange={(e) =>
                  setStudentID((prev) => ({
                    ...prev,
                    addmissionNumber: e.target.value,
                  }))
                }
                placeholder="Type your Student/Admission Id"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="studentID"
                  value={StudentID.Q_Id}
                  onChange={(e) =>
                    setStudentID((prev) => ({
                      ...prev,
                      Q_Id: e.target.value,
                    }))
                  }
                  placeholder="Type Qatar National Identification Number"
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
              type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default QIDLogin;
