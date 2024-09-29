import React, { useState } from "react";
import Logo from "../../../../Components/Common/Logo";
import { FaEye } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { studentLogin } from "../../../../Store/Slices/Common/Auth/actions/studentActions";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { FcInfo } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../../../Components/Common/Modal";
import { AiOutlinePhone } from "react-icons/ai";
import StudentDiwanLogo from "../../../../Assets/HomeAssets/StudentDiwanLogo.png";

const StudentLoginForm = () => {
  const [studentDetails, setStudentDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state) => state.common.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentDetails.email || !studentDetails.password) {
      toast.error("Please add the required details");
      return;
    }
    dispatch(studentLogin(studentDetails))
      .unwrap()
      .then(({ redirect }) => {
        navigate(redirect);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Student Account</h2>
            <button onClick={openModal} aria-label="Open information modal">
              <FcInfo className="text-2xl" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <h6>Login in using:</h6>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={studentDetails.email}
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
                  value={studentDetails.password}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <PiEyeClosedFill />}
                </button>
              </div>
            </div>
            <div className="mb-6 text-right">
              <NavLink
                to="/forget_password"
                state={{ role: "student" }}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Forgot password
              </NavLink>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center"
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
          <div className="text-center py-2">
            <span className="opacity-70">New to Student Diwan?</span>{" "}
            <NavLink
              className="text-indigo-600 hover:text-indigo-900"
              to="/signup"
            >
              Apply Now
            </NavLink>
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <div className="">
          <img
            src={StudentDiwanLogo}
            alt="logo"
            className="mx-auto mb-4 h-18 w-60 "
          />
          <h2 className="text-2xl    font-semibold mb-4" id="modal-title">
            Information
          </h2>
          <p className="mb-6 capitalize">
            If you have{" "}
            <b>already applied, please wait for your login credentials. </b>
            It may take 4-5 working days. For any queries, contact us at:
          </p>
          <div className="flex   mb-4">
            <AiOutlinePhone className="text-xl mr-2" />
            <span className="font-semibold">Phone: 123-456-7890</span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="mt-6 bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentLoginForm;
