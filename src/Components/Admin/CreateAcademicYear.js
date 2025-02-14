import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { createAcademicYear } from "../../Store/Slices/Common/Auth/actions/staffActions"; // Ensure correct path
import Logo from "../Common/Logo";
import { IoIosArrowRoundBack } from "react-icons/io";

const CreateAcademicYear = () => {
  const [yearData, setYearData] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.common.auth); // Get loading state from Redux store

  const handleBack = () => {
    navigate(-1); // Navigate one step back in history
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yearData.year || !yearData.startDate || !yearData.endDate) {
      return toast.error("Please fill all the fields");
    }

    // Dispatch the createAcademicYear action
    dispatch(createAcademicYear(yearData))
      .unwrap()
      .then(() => {
        navigate("/select_branch"); // Redirect to dashboard on success
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="relative h-screen bg-gray-100 w-full">
      <div className="absolute top-0 right-0 p-6">
        <NavLink to="/" className="text-sm text-gray-500 hover:text-gray-700">
          <Logo />
        </NavLink>
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="bg-white border p-8 rounded-lg w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700  items-center flex gap-2 focus:outline-none"
            >
              <div className="rounded-full border-2 text-xl w-6 h-6 flex justify-center items-center">
                <IoIosArrowRoundBack />
              </div>
            </button>
            <h2 className="text-2xl font-semibold">Create Academic Year</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Academic Year (YYYY-YYYY)
              </label>
              <input
                type="text"
                id="year"
                value={yearData.year}
                onChange={(e) =>
                  setYearData({ ...yearData, year: e.target.value })
                }
                placeholder="2024-2025"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={yearData.startDate}
                onChange={(e) =>
                  setYearData({ ...yearData, startDate: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={yearData.endDate}
                onChange={(e) =>
                  setYearData({ ...yearData, endDate: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={yearData.isActive}
                  onChange={(e) =>
                    setYearData({ ...yearData, isActive: e.target.checked })
                  }
                />
                <span className="ml-2 text-sm text-gray-700">
                  Set as Active Year
                </span>
              </label>
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
                "Create Academic Year"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAcademicYear;
