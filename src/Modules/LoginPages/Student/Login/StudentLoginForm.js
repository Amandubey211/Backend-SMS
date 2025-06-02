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
import StudentDiwanLogo from "../../../../Assets/HomeAssets/StudentDiwanLogo.png";
import { IoIosArrowRoundBack } from "react-icons/io";

const StudentLoginForm = () => {
  const [studentDetails, setStudentDetails] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isShaking, setIsShaking] = useState(false); // State for shake animation
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state) => state.common.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setStudentDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Reset shake state
  };

  const validateForm = () => {
    const newErrors = {};
    if (!studentDetails.email.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!studentDetails.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors)?.length > 0) {
      triggerShake();
    }

    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(studentLogin(studentDetails))
      .unwrap()
      .then(({ redirect }) => {
        navigate(redirect);
      })
      .catch((error) => {
        // Clear password on error
        setStudentDetails((prev) => ({
          ...prev,
          password: "",
        }));
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
              <IoIosArrowRoundBack />
            </div>
            <span>LMS Home</span>
          </NavLink>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Student Account</h2>
            <button onClick={openModal} aria-label="Open information modal">
              <FcInfo className="text-2xl" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className={isShaking ? "animate-shake" : ""} // Tailwind shake animation
          >
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={studentDetails.email}
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
                  value={studentDetails.password}
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
                state={{ role: "student" }}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Forgot password
              </NavLink>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 text-center"
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
        <div className="text-center">
          <img
            src={StudentDiwanLogo}
            alt="logo"
            className="mx-auto mb-4 h-18 w-60 "
          />
          <h2 className="text-2xl font-semibold mb-4" id="modal-title">
            Information
          </h2>
          <p className="mb-6 capitalize">
            If you have <strong>already submitted your application</strong>,
            please allow 4-5 business days to receive your login credentials.
            For any inquiries, please contact your respective school.
          </p>
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
