import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { promoteStudents } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { motion } from "framer-motion"; // For animations
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

const PromoteClass = ({ student }) => {
  const dispatch = useDispatch();

  // Fetch class and academic year data from Redux store
  const classes = useSelector((state) => state.admin.class.classes);
  const academicYears = useSelector((state) => state.common.auth.AcademicYear);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const { loading } = useSelector((state) => state.admin.students);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // Fetch classes and academic years if necessary
    if (classes.length === 0) {
      // Dispatch thunk to fetch classes
    }
    if (academicYears.length === 0) {
      // Dispatch thunk to fetch academic years
    }
  }, [dispatch, classes, academicYears]);

  const handlePromotion = (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedAcademicYear) {
      alert("Please select both class and academic year");
      return;
    }

    // Show confirmation modal before promoting
    setIsModalOpen(true);
  };

  const confirmPromotion = async () => {
    setConfirmLoading(true);
    try {
      await dispatch(
        promoteStudents({
          studentIds: [student._id],
          promotionClassId: selectedClass,
          academicYearId: selectedAcademicYear,
        })
      );
      setIsModalOpen(false); // Close modal after successful promotion
    } catch (error) {
      console.error("Promotion failed:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <motion.form
        className="flex flex-col justify-between min-h-screen p-4" // Flexbox ensures button is always at the bottom
        onSubmit={handlePromotion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Student Details */}
        <div className="bg-white p-4 w-full max-w-md mx-auto flex-grow">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={
                student.profile || profileIcon
              }
              alt={`${student.firstName} ${student.lastName}`}
              className="w-24 h-24 rounded-full"
              loading="lazy"
            />
            <div className="flex flex-col">
              <div className="text-xl font-semibold">{`${student.firstName} ${student.lastName}`}</div>
              <div className="text-sm text-gray-500">
                Admission Number: {student.admissionNumber || "N/A"}
              </div>
              <div className="text-sm text-gray-500">
                Class: {student.className || "N/A"}
              </div>
              <div className="text-sm text-gray-500">
                Section: {student.sectionName || "N/A"}
              </div>
            </div>
          </div>

          {/* Select Class */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={loading}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Select Academic Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Academic Year
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={loading}
            >
              <option value="">Select Year</option>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.academicYear}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          className="mb-10 sticky bottom-0 w-full max-w-md mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Promoting..." : "Promote Student"}
          </button>
        </motion.div>
      </motion.form>

      {/* Confirmation Modal */}
      <DeleteConfirmatiomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmPromotion}
        loading={confirmLoading}
        text="Promote"
      />
    </>
  );
};

export default PromoteClass;
