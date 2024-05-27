import React, { useState } from "react";
import Logo from "../../../../Components/Logo";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import useStudentLogin from "../../../../Hooks/AuthHooks/Student/useStudentLogin";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
// import { setIsSignInPage } from "../../../Redux/Slices/AuthSlice";
// import { useDispatch } from "react-redux";

const StudentLoginForm = () => {
  const [StudentDetails, setStudentDetails] = useState({
    email: "",
    password: "",
  });
  const { loading, studentLogin } = useStudentLogin();

  // const dispatch = useDispatch();
  const HandleSubmit = (e) => {
    e.preventDefault();
    if (!StudentDetails) return toast.error("please add the required details");
    studentLogin(StudentDetails);
  };
  const [showPassword, setShowPassword] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);
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
            <h2 className="text-2xl font-semibold">Student Account</h2>
            {/* <button
              onClick={openModal}
              className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-black py-2 px-3 rounded-md hover:from-pink-600 hover:to-purple-600"
            >
              Open Modal
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <h1 className="text-lg font-bold">Modal Title</h1>
              <p className="mt-4">This is the modal content.</p>
            </Modal> */}
          </div>
          <form onSubmit={HandleSubmit}>
            <h6>Login in using:</h6>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={StudentDetails.email}
                onChange={(e) =>
                  setStudentDetails((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Type your email"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={StudentDetails.password}
                  onChange={(e) =>
                    setStudentDetails((prev) => ({
                      ...prev,
                      password: e.target.value,
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
                Forgot password
              </NavLink>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center  "
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
          <div className="text-center py-2">
            <span className="opacity-70">New to Student Diwan?</span>{" "}
            <NavLink
              // onClick={() => dispatch(setIsSignInPage(false))}
              className="text-indigo-600 hover:text-indigo-900"
              to="/signUp"
            >
              Apply Now
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginForm;
