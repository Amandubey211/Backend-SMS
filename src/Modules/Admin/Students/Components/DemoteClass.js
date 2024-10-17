import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { demoteStudents } from "../../../../Store/Slices/Admin/Class/Students/studentThunks"; // Import the demote thunk
import { motion } from "framer-motion"; // For animations
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";

const DemoteClass = ({ student }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for confirmation action

  const { loading } = useSelector((state) => state.admin.students);

  useEffect(() => {
    // Any required data fetching (if needed)
  }, [dispatch]);

  const handleDemotion = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Show the confirmation modal before demotion
  };

  const confirmDemotion = async () => {
    setConfirmLoading(true);
    try {
      await dispatch(
        demoteStudents({
          studentIds: [student._id],
        })
      );
      setIsModalOpen(false); // Close the modal after successful demotion
    } catch (error) {
      console.error("Demotion failed:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <motion.form
        className="flex flex-col justify-between min-h-screen p-4" // Flexbox ensures button is always at the bottom
        onSubmit={handleDemotion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Student Details */}
        <div className="bg-white p-4 w-full max-w-md mx-auto flex-grow">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={
                student.profile ||
                `https://randomuser.me/api/portraits/med/${
                  student._id % 2 === 0 ? "women" : "men"
                }/${student._id}.jpg`
              }
              alt={`${student.firstName} ${student.lastName}`}
              className="w-14 h-14 rounded-full"
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
        </div>

        {/* Submit Button */}
        <motion.div
          className="mb-10 sticky bottom-0 w-full max-w-md mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-600 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Demoting..." : "Demote Student"}
          </button>
        </motion.div>
      </motion.form>

      {/* Confirmation Modal */}
      <DeleteConfirmatiomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDemotion}
        loading={confirmLoading}
        text="Demote"
      />
    </>
  );
};

export default DemoteClass;
