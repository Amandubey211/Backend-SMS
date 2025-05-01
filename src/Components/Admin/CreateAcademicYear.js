import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createAcademicYear } from "../../Store/Slices/Common/Auth/actions/staffActions";
import Logo from "../Common/Logo";

// Ant Design imports
import { Input, DatePicker, Switch, Button, Tooltip } from "antd";
import dayjs from "dayjs";

// Icons
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

// Reusable guidelines modal
import ReusableGuidelinesModal from "../Common/Modals/ReusableGuidelinesModal";

// Layout and Background Image for the page layout
import Layout from "../../Components/Common/Layout";
import HomeBackground from "../../Assets/HomeAssets/HomeBackground.png";

const CreateAcademicYear = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.common.auth);

  // Form state
  const [yearData, setYearData] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isActive: true, // Always true (non-editable)
  });

  // Error state for validation feedback
  const [errors, setErrors] = useState({
    year: "",
    startDate: "",
    endDate: "",
  });

  // Guidelines Modal state
  const [showGuidelines, setShowGuidelines] = useState(false);

  // ------------------
  // VALIDATION HELPERS
  // ------------------
  const isYearValid = () => /^\d{4}-\d{4}$/.test(yearData.year);

  const isDateRangeValid = () => {
    if (!yearData.startDate || !yearData.endDate) return true;
    return dayjs(yearData.startDate).isBefore(dayjs(yearData.endDate));
  };

  const validateYear = (value) => {
    if (!value) return "Year is required.";
    if (!/^\d{4}-\d{4}$/.test(value)) return "Year format must be YYYY-YYYY.";
    return "";
  };

  const validateStartDate = (startVal) => {
    if (!startVal) return "Start Date is required.";
    if (
      yearData.endDate &&
      !dayjs(startVal).isBefore(dayjs(yearData.endDate))
    ) {
      return "Start Date must be earlier than End Date.";
    }
    return "";
  };

  const validateEndDate = (endVal) => {
    if (!endVal) return "End Date is required.";
    if (
      yearData.startDate &&
      !dayjs(yearData.startDate).isBefore(dayjs(endVal))
    ) {
      return "End Date must be after Start Date.";
    }
    return "";
  };

  // ------------------
  // HANDLERS
  // ------------------
  const handleBack = () => {
    navigate(-1);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYearData({ ...yearData, year: value });
    setErrors((prev) => ({ ...prev, year: validateYear(value) }));
  };

  /**
   * If user-typed date is invalid or empty, we reset the state
   * to avoid "Invalid Date" rendering in the calendar cells.
   */
  const handleStartDateChange = (date, dateString) => {
    setYearData((prev) => ({
      ...prev,
      startDate: date && date.isValid() ? dateString : "",
    }));
  
    setErrors((prev) => ({
      ...prev,
      startDate: "",
      endDate:
        yearData.endDate && date && dayjs(dateString, "DD-MM-YYYY").isAfter(dayjs(yearData.endDate, "DD-MM-YYYY"))
          ? "End Date must be after Start Date."
          : "",
    }));
  };
  
  const handleEndDateChange = (date, dateString) => {
    setYearData((prev) => ({
      ...prev,
      endDate: date && date.isValid() ? dateString : "",
    }));
  
    setErrors((prev) => ({
      ...prev,
      endDate:
        date && yearData.startDate && dayjs(dateString, "DD-MM-YYYY").isBefore(dayjs(yearData.startDate, "DD-MM-YYYY"))
          ? "End Date must be after Start Date."
          : "",
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!yearData.startDate || !yearData.endDate) {
      toast.error("Both Start Date and End Date are required.");
      return;
    }
  
    if (dayjs(yearData.startDate, "DD-MM-YYYY").isAfter(dayjs(yearData.endDate, "DD-MM-YYYY"))) {
      toast.error("End Date must be after Start Date.");
      return;
    }
  
    dispatch(createAcademicYear(yearData))
      .unwrap()
      .then(() => {
        toast.success("Academic Year Created Successfully!");
        navigate("/select_branch");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  

  return (
    <Layout title="Create Academic Year | Student Diwan">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        {/* Left Section: Form */}
        <div className="md:col-span-7 flex items-center justify-center relative">
          {/* Form Container */}
          <div className="w-full max-w-md">
            {/* Guidelines Modal */}
            <ReusableGuidelinesModal
              visible={showGuidelines}
              onClose={() => setShowGuidelines(false)}
              title="Academic Year Creation Guidelines"
              icon={FiInfo}
            >
              <ul className="list-none text-gray-700 pl-6 space-y-2">
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>Use the format YYYY-YYYY (e.g., 2024-2025).</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>Ensure the Start Date is before the End Date.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>The academic year is always set as active.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>All fields are required for a valid submission.</span>
                </li>
              </ul>
            </ReusableGuidelinesModal>

            {/* Logo at the top-right of the left section (only visible on larger screens) */}
            <div className="absolute top-0 right-0 p-6 hidden md:block">
              <Logo />
            </div>

            <div className="bg-white border p-8 rounded-lg">
              {/* Header Row: Back Button, Title, and Guidelines Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBack}
                    className="text-sm text-gray-500 hover:text-gray-700 flex gap-2 focus:outline-none"
                  >
                    <div className="rounded-full border-2 text-xl w-6 h-6 flex justify-center items-center">
                      <IoIosArrowRoundBack />
                    </div>
                  </button>
                  <h2 className="text-xl font-semibold">
                    Create Academic Year
                  </h2>
                </div>
                {/* Guidelines Icon Button */}
                <Tooltip title="Guidelines">
                  <Button
                    shape="circle"
                    icon={<FiInfo />}
                    onClick={() => setShowGuidelines(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-none"
                  />
                </Tooltip>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Academic Year Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Academic Year (YYYY-YYYY)
                  </label>
                  <Input
                    placeholder="2024-2025"
                    value={yearData.year}
                    onChange={handleYearChange}
                    className={`h-12 ${errors.year ? "border-red-500" : ""}`}
                    suffix={
                      errors.year ? (
                        <FiXCircle className="text-red-500" />
                      ) : yearData.year && isYearValid() ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : null
                    }
                  />
                  {errors.year && (
                    <p className="text-red-500 text-xs mt-1">{errors.year}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <DatePicker
                    className={`w-full h-12 ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                    format="DD-MM-YYYY"
                    value={
                      yearData.startDate
                        ? dayjs(yearData.startDate, "DD-MM-YYYY")
                        : null
                    }
                    onChange={handleStartDateChange}
                    suffixIcon={
                      errors.startDate ? (
                        <FiXCircle className="text-red-500" />
                      ) : yearData.startDate && isDateRangeValid() ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : (
                        <FiCalendar />
                      )
                    }
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <DatePicker
                    className={`w-full h-12 ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                    format="DD-MM-YYYY"
                    value={
                      yearData.endDate
                        ? dayjs(yearData.endDate, "DD-MM-YYYY")
                        : null
                    }
                    onChange={handleEndDateChange}
                    suffixIcon={
                      errors.endDate ? (
                        <FiXCircle className="text-red-500" />
                      ) : yearData.endDate && isDateRangeValid() ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : (
                        <FiCalendar />
                      )
                    }
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                {/* Active Year (always enabled, non-editable) */}
                <div className="flex items-center mt-4">
                  <Switch checked={yearData.isActive} disabled />
                  <span className="ml-2 text-sm text-gray-700">
                    Set as Active Year
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-gradient-to-r !from-pink-500 !to-purple-500 !border-none hover:!from-pink-600 hover:!to-purple-600 h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <LuLoader className="animate-spin text-2xl" />
                  ) : (
                    "Create Academic Year"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section: Background Image */}
        <div className="md:col-span-5 relative">
          <img
            src={HomeBackground}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateAcademicYear;
